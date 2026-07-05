// --- Usuario ---

async function obtenerUsuario() {
  const usuarios = await dbObtenerTodos('usuarios');
  return usuarios.length > 0 ? usuarios[0] : null;
}

async function crearUsuario(nombre) {
  const existente = await obtenerUsuario();
  if (existente) return existente;

  return dbAgregar('usuarios', { nombre, creado_en: new Date().toISOString() });
}

// --- Perfil ---

async function obtenerPerfil(usuarioId) {
  return dbObtenerPorId('perfil', Number(usuarioId));
}

async function guardarPerfil(usuarioId, datosPerfil) {
  const perfil = {
    usuario_id: Number(usuarioId),
    ...datosPerfil,
    actualizado_en: new Date().toISOString()
  };
  return dbGuardar('perfil', perfil);
}

// --- Objetivos ---

async function obtenerObjetivoActivo(usuarioId) {
  const objetivos = await dbObtenerPorIndice('objetivos', 'usuario_id', Number(usuarioId));
  return objetivos.find(o => o.activo === 1) || null;
}

async function calcularVistaPreviaObjetivo(usuarioId, tipo) {
  const perfil = await obtenerPerfil(usuarioId);
  if (!perfil) throw new Error('Debes completar tu perfil antes de definir un objetivo');
  return calcularCaloriasYMacros(perfil, tipo);
}

async function guardarObjetivo(usuarioId, tipo, macrosManuales = null) {
  const perfil = await obtenerPerfil(usuarioId);
  if (!perfil) throw new Error('Debes completar tu perfil antes de definir un objetivo');

  const macros = macrosManuales || calcularCaloriasYMacros(perfil, tipo);
  const calculadoAutomaticamente = macrosManuales ? 0 : 1;

  // Desactivar objetivos anteriores
  const anteriores = await dbObtenerPorIndice('objetivos', 'usuario_id', Number(usuarioId));
  for (const obj of anteriores.filter(o => o.activo === 1)) {
    obj.activo = 0;
    obj.fecha_fin = new Date().toISOString();
    await dbGuardar('objetivos', obj);
  }

  const nuevoObjetivo = {
    usuario_id: Number(usuarioId),
    tipo,
    calorias_objetivo: macros.calorias,
    proteinas_objetivo_g: macros.proteinas_g,
    carbohidratos_objetivo_g: macros.carbohidratos_g,
    grasas_objetivo_g: macros.grasas_g,
    calculado_automaticamente: calculadoAutomaticamente,
    fecha_inicio: new Date().toISOString(),
    fecha_fin: null,
    activo: 1
  };

  return dbAgregar('objetivos', nuevoObjetivo);
}
// --- Categorias ---

async function obtenerCategorias() {
  return dbObtenerTodos('categorias');
}

// --- Alimentos ---

async function buscarAlimentos(texto = '') {
  const todos = await dbObtenerTodos('alimentos');
  const categorias = await obtenerCategorias();

  const conCategoria = todos.map(a => ({
    ...a,
    categoria_nombre: categorias.find(c => c.id === a.categoria_id)?.nombre || null
  }));

  if (!texto) return conCategoria.sort((a, b) => a.nombre.localeCompare(b.nombre));

  return conCategoria
    .filter(a => a.nombre.toLowerCase().includes(texto.toLowerCase()))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
}

async function crearAlimentoPersonalizado(datos) {
  return dbAgregar('alimentos', {
    ...datos,
    categoria_id: datos.categoria_id ? Number(datos.categoria_id) : null,
    fibra_100g: 0,
    sodio_100g: 0,
    azucar_100g: 0,
    es_personalizado: 1,
    creado_en: new Date().toISOString()
  });
}

// --- Recetas ---

function calcularMacrosDeIngredientes(ingredientes) {
  return ingredientes.reduce((acc, ing) => {
    const factor = ing.gramos / 100;
    acc.calorias += ing.calorias_100g * factor;
    acc.proteinas_g += ing.proteinas_100g * factor;
    acc.carbohidratos_g += ing.carbohidratos_100g * factor;
    acc.grasas_g += ing.grasas_100g * factor;
    return acc;
  }, { calorias: 0, proteinas_g: 0, carbohidratos_g: 0, grasas_g: 0 });
}

function redondearMacros(macros) {
  return {
    calorias: Math.round(macros.calorias),
    proteinas_g: Math.round(macros.proteinas_g * 10) / 10,
    carbohidratos_g: Math.round(macros.carbohidratos_g * 10) / 10,
    grasas_g: Math.round(macros.grasas_g * 10) / 10
  };
}

async function obtenerIngredientesDeReceta(recetaId) {
  const items = await dbObtenerPorIndice('receta_ingredientes', 'receta_id', Number(recetaId));
  const alimentos = await dbObtenerTodos('alimentos');

  return items.map(item => {
    const alimento = alimentos.find(a => a.id === item.alimento_id);
    return { ...item, alimento_nombre: alimento?.nombre, ...alimento };
  });
}

async function calcularMacrosDeReceta(recetaId) {
  const ingredientes = await obtenerIngredientesDeReceta(recetaId);
  return redondearMacros(calcularMacrosDeIngredientes(ingredientes));
}

async function obtenerRecetas() {
  const recetas = await dbObtenerTodos('recetas');
  const resultado = [];
  for (const receta of recetas) {
    const macros = await calcularMacrosDeReceta(receta.id);
    resultado.push({ ...receta, macros });
  }
  return resultado;
}

async function crearReceta(datos) {
  const { ingredientes, ...datosReceta } = datos;

  const receta = await dbAgregar('recetas', {
    ...datosReceta,
    creado_en: new Date().toISOString()
  });

  for (const ing of ingredientes) {
    await dbAgregar('receta_ingredientes', {
      receta_id: receta.id,
      alimento_id: Number(ing.alimento_id),
      gramos: ing.gramos
    });
  }

  return receta;
}

async function eliminarReceta(id) {
  await dbEliminar('recetas', Number(id));
  const ingredientes = await dbObtenerPorIndice('receta_ingredientes', 'receta_id', Number(id));
  for (const ing of ingredientes) {
    await dbEliminar('receta_ingredientes', ing.id);
  }
}