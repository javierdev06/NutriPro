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