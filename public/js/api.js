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
// --- Calendario ---

const TIPOS_COMIDA = ['desayuno', 'colacion', 'almuerzo', 'merienda', 'once', 'snack_nocturno'];

async function calcularMacrosDeItem(item) {
  if (item.alimento_id) {
    const alimentos = await dbObtenerTodos('alimentos');
    const alimento = alimentos.find(a => a.id === item.alimento_id);
    const factor = item.gramos / 100;
    return redondearMacros({
      calorias: alimento.calorias_100g * factor,
      proteinas_g: alimento.proteinas_100g * factor,
      carbohidratos_g: alimento.carbohidratos_100g * factor,
      grasas_g: alimento.grasas_100g * factor
    });
  }

  if (item.receta_id) {
    const macrosBase = await calcularMacrosDeReceta(item.receta_id);
    return redondearMacros({
      calorias: macrosBase.calorias * item.porciones,
      proteinas_g: macrosBase.proteinas_g * item.porciones,
      carbohidratos_g: macrosBase.carbohidratos_g * item.porciones,
      grasas_g: macrosBase.grasas_g * item.porciones
    });
  }

  return { calorias: 0, proteinas_g: 0, carbohidratos_g: 0, grasas_g: 0 };
}

function sumarMacros(listaMacros) {
  return listaMacros.reduce((acc, m) => {
    acc.calorias += m.calorias;
    acc.proteinas_g += m.proteinas_g;
    acc.carbohidratos_g += m.carbohidratos_g;
    acc.grasas_g += m.grasas_g;
    return acc;
  }, { calorias: 0, proteinas_g: 0, carbohidratos_g: 0, grasas_g: 0 });
}

async function obtenerItemsDeComida(comidaId) {
  const items = await dbObtenerPorIndice('comida_items', 'comida_id', comidaId);
  const alimentos = await dbObtenerTodos('alimentos');
  const recetas = await dbObtenerTodos('recetas');

  const resultado = [];
  for (const item of items) {
    const alimento = item.alimento_id ? alimentos.find(a => a.id === item.alimento_id) : null;
    const receta = item.receta_id ? recetas.find(r => r.id === item.receta_id) : null;
    const macros = await calcularMacrosDeItem(item);
    resultado.push({
      ...item,
      alimento_nombre: alimento?.nombre,
      receta_nombre: receta?.nombre,
      macros
    });
  }
  return resultado;
}

async function obtenerDia(usuarioId, fechaISO) {
  usuarioId = Number(usuarioId);
  const dias = await dbObtenerPorIndice('dias', 'usuario_fecha', [usuarioId, fechaISO]);
  let dia = dias[0];

  if (!dia) {
    dia = await dbAgregar('dias', { usuario_id: usuarioId, fecha: fechaISO });
    for (const tipo of TIPOS_COMIDA) {
      await dbAgregar('comidas', { dia_id: dia.id, tipo });
    }
  }

  const comidas = await dbObtenerPorIndice('comidas', 'dia_id', dia.id);
  const comidasConItems = [];

  for (const comida of comidas) {
    const items = await obtenerItemsDeComida(comida.id);
    const macros = sumarMacros(items.map(i => i.macros));
    comidasConItems.push({ ...comida, items, macros });
  }

  const macrosDelDia = sumarMacros(comidasConItems.flatMap(c => c.items.map(i => i.macros)));

  return { ...dia, comidas: comidasConItems, macrosDelDia };
}

async function agregarItemComida(comidaId, datos) {
  return dbAgregar('comida_items', {
    comida_id: Number(comidaId),
    alimento_id: datos.alimento_id ? Number(datos.alimento_id) : null,
    receta_id: datos.receta_id ? Number(datos.receta_id) : null,
    gramos: datos.gramos || null,
    porciones: datos.porciones || 1
  });
}

async function eliminarItemComida(itemId) {
  await dbEliminar('comida_items', Number(itemId));
}

// --- Agua ---

async function obtenerAgua(usuarioId, fechaISO) {
  usuarioId = Number(usuarioId);
  const registros = await dbObtenerPorIndice('registro_agua', 'usuario_fecha', [usuarioId, fechaISO]);

  if (registros.length > 0) return registros[0];

  return dbAgregar('registro_agua', {
    usuario_id: usuarioId,
    fecha: fechaISO,
    mililitros: 0,
    meta_ml: 2000
  });
}

async function agregarAgua(usuarioId, fechaISO, mililitros) {
  const registro = await obtenerAgua(usuarioId, fechaISO);
  registro.mililitros = Math.max(0, registro.mililitros + mililitros);
  return dbGuardar('registro_agua', registro);
}

// --- Inventario ---

async function obtenerInventario(usuarioId) {
  const items = await dbObtenerPorIndice('inventario', 'usuario_alimento', IDBKeyRange.bound(
    [Number(usuarioId), -Infinity], [Number(usuarioId), Infinity]
  ));
  const alimentos = await dbObtenerTodos('alimentos');

  return items.map(item => ({
    ...item,
    alimento_nombre: alimentos.find(a => a.id === item.alimento_id)?.nombre
  })).sort((a, b) => a.alimento_nombre.localeCompare(b.alimento_nombre));
}

async function guardarEnInventario(usuarioId, alimentoId, cantidadGramos) {
  usuarioId = Number(usuarioId);
  alimentoId = Number(alimentoId);

  const existentes = await dbObtenerPorIndice('inventario', 'usuario_alimento', [usuarioId, alimentoId]);

  if (existentes.length > 0) {
    existentes[0].cantidad_gramos = cantidadGramos;
    existentes[0].actualizado_en = new Date().toISOString();
    return dbGuardar('inventario', existentes[0]);
  }

  return dbAgregar('inventario', {
    usuario_id: usuarioId,
    alimento_id: alimentoId,
    cantidad_gramos: cantidadGramos,
    actualizado_en: new Date().toISOString()
  });
}

async function ajustarInventario(usuarioId, alimentoId, delta) {
  usuarioId = Number(usuarioId);
  alimentoId = Number(alimentoId);

  const existentes = await dbObtenerPorIndice('inventario', 'usuario_alimento', [usuarioId, alimentoId]);
  const actual = existentes[0]?.cantidad_gramos || 0;
  const nuevaCantidad = Math.max(0, actual + delta);

  await guardarEnInventario(usuarioId, alimentoId, nuevaCantidad);
  return { cantidad_gramos: nuevaCantidad };
}

async function eliminarDeInventario(usuarioId, alimentoId) {
  const existentes = await dbObtenerPorIndice('inventario', 'usuario_alimento', [Number(usuarioId), Number(alimentoId)]);
  if (existentes[0]) await dbEliminar('inventario', existentes[0].id);
}

async function obtenerNecesidadesSemana(usuarioId, inicioISO, finISO) {
  usuarioId = Number(usuarioId);
  const necesidades = {};

  const todosDias = await dbObtenerTodos('dias');
  const diasDeUsuario = todosDias.filter(
    d => d.usuario_id === usuarioId && d.fecha >= inicioISO && d.fecha <= finISO
  );

  for (const dia of diasDeUsuario) {
    const comidas = await dbObtenerPorIndice('comidas', 'dia_id', dia.id);
    for (const comida of comidas) {
      const items = await dbObtenerPorIndice('comida_items', 'comida_id', comida.id);
      for (const item of items) {
        if (item.alimento_id) {
          necesidades[item.alimento_id] = (necesidades[item.alimento_id] || 0) + item.gramos;
        }
        if (item.receta_id) {
          const ingredientes = await obtenerIngredientesDeReceta(item.receta_id);
          for (const ing of ingredientes) {
            const gramosUsados = ing.gramos * item.porciones;
            necesidades[ing.alimento_id] = (necesidades[ing.alimento_id] || 0) + gramosUsados;
          }
        }
      }
    }
  }

  const alimentos = await dbObtenerTodos('alimentos');
  const inventario = await obtenerInventario(usuarioId);
  const resultado = [];

  for (const [alimentoId, gramosNecesarios] of Object.entries(necesidades)) {
    const alimento = alimentos.find(a => a.id === Number(alimentoId));
    const enInventario = inventario.find(i => i.alimento_id === Number(alimentoId));
    const disponible = enInventario ? enInventario.cantidad_gramos : 0;
    const faltante = Math.max(0, gramosNecesarios - disponible);

    resultado.push({
      alimento_id: Number(alimentoId),
      nombre: alimento.nombre,
      necesario_gramos: Math.round(gramosNecesarios),
      disponible_gramos: Math.round(disponible),
      faltante_gramos: Math.round(faltante)
    });
  }

  return resultado.sort((a, b) => b.faltante_gramos - a.faltante_gramos);
}

// --- Peso ---

async function obtenerHistorialPeso(usuarioId) {
  const registros = await dbObtenerPorIndice('registro_peso', 'usuario_id', Number(usuarioId));
  return registros.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
}

async function crearRegistroPeso(usuarioId, datos) {
  usuarioId = Number(usuarioId);

  const registro = await dbAgregar('registro_peso', {
    usuario_id: usuarioId,
    peso_kg: datos.peso_kg,
    porcentaje_grasa: datos.porcentaje_grasa || null,
    masa_muscular_kg: datos.masa_muscular_kg || null,
    fecha: new Date().toISOString()
  });

  const perfil = await obtenerPerfil(usuarioId);
  if (perfil) {
    perfil.peso_actual_kg = datos.peso_kg;
    await dbGuardar('perfil', perfil);
  }

  return registro;
}

async function eliminarRegistroPeso(id) {
  await dbEliminar('registro_peso', Number(id));
}

// --- Recordatorios ---

async function obtenerRecordatorios(usuarioId) {
  const registros = await dbObtenerPorIndice('recordatorios', 'usuario_tipo', IDBKeyRange.bound(
    [Number(usuarioId), ''], [Number(usuarioId), '\uffff']
  ));
  return registros.sort((a, b) => a.hora.localeCompare(b.hora));
}

async function guardarRecordatorio(usuarioId, tipo, hora, activo) {
  usuarioId = Number(usuarioId);
  const existentes = await dbObtenerPorIndice('recordatorios', 'usuario_tipo', [usuarioId, tipo]);

  const registro = {
    usuario_id: usuarioId,
    tipo,
    hora,
    activo: activo ? 1 : 0
  };

  if (existentes.length > 0) {
    registro.id = existentes[0].id;
  }

  return dbGuardar('recordatorios', registro);
}
// --- Generador de plan semanal ---

const DISTRIBUCION_CALORIAS = {
  desayuno: 0.20,
  colacion: 0.10,
  almuerzo: 0.30,
  merienda: 0.10,
  once: 0.20,
  snack_nocturno: 0.10
};

const COMPOSICION_COMIDAS = {
  desayuno: [
    { categoria: 'Carbohidratos', proporcion: 0.5 },
    { categoria: 'Proteinas animales', proporcion: 0.3 },
    { categoria: 'Frutas', proporcion: 0.2 }
  ],
  colacion: [
    { categoria: 'Frutas', proporcion: 0.6 },
    { categoria: 'Grasas y frutos secos', proporcion: 0.4 }
  ],
  almuerzo: [
    { categoria: 'Proteinas animales', proporcion: 0.4 },
    { categoria: 'Carbohidratos', proporcion: 0.4 },
    { categoria: 'Verduras', proporcion: 0.2 }
  ],
  merienda: [
    { categoria: 'Lacteos', proporcion: 0.6 },
    { categoria: 'Grasas y frutos secos', proporcion: 0.4 }
  ],
  once: [
    { categoria: 'Carbohidratos', proporcion: 0.5 },
    { categoria: 'Proteinas animales', proporcion: 0.3 },
    { categoria: 'Verduras', proporcion: 0.2 }
  ],
  snack_nocturno: [
    { categoria: 'Lacteos', proporcion: 0.7 },
    { categoria: 'Frutas', proporcion: 0.3 }
  ]
};

async function generarPlanSemanal(usuarioId, fechaInicioISO) {
  const perfil = await obtenerPerfil(usuarioId);
  const objetivo = await obtenerObjetivoActivo(usuarioId);

  if (!perfil) throw new Error('Primero debes completar tu perfil');
  if (!objetivo) throw new Error('Primero debes definir tu objetivo');

  const alimentos = await dbObtenerTodos('alimentos');
  const categorias = await obtenerCategorias();
  const idPorCategoria = {};
  categorias.forEach(c => idPorCategoria[c.nombre] = c.id);

  for (let diaIndex = 0; diaIndex < 7; diaIndex++) {
    const fecha = new Date(fechaInicioISO + 'T00:00:00');
    fecha.setDate(fecha.getDate() + diaIndex);
    const fechaISO = formatearFechaISO(fecha);

    const dia = await obtenerDia(usuarioId, fechaISO);

    for (const comida of dia.comidas) {
      // Limpia los items existentes de esta comida antes de generar el plan nuevo
      for (const item of comida.items) {
        await eliminarItemComida(item.id);
      }

      const composicion = COMPOSICION_COMIDAS[comida.tipo];
      const caloriasComida = objetivo.calorias_objetivo * DISTRIBUCION_CALORIAS[comida.tipo];

      for (const slot of composicion) {
        const categoriaId = idPorCategoria[slot.categoria];
        const opciones = alimentos.filter(a => a.categoria_id === categoriaId);
        if (opciones.length === 0) continue;

        // Rota el alimento segun el dia, para que la semana tenga variedad
        const alimento = opciones[diaIndex % opciones.length];
        const caloriasSlot = caloriasComida * slot.proporcion;

        let gramos = Math.round((caloriasSlot * 100 / alimento.calorias_100g) / 5) * 5;
        gramos = Math.max(20, gramos);

        await agregarItemComida(comida.id, { alimento_id: alimento.id, gramos });
      }
    }
  }
}