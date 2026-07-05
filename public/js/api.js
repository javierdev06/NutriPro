async function verificarBackend() {
  const estadoElemento = document.getElementById('estado-backend');
  if (!estadoElemento) return;

  try {
    const respuesta = await fetch('/api/health');
    const datos = await respuesta.json();
    estadoElemento.textContent = datos.message;
  } catch (error) {
    estadoElemento.textContent = 'No se pudo conectar con el backend';
  }
}

// --- Usuario ---

async function obtenerUsuario() {
  const respuesta = await fetch('/api/usuario');
  if (respuesta.status === 404) return null;
  return respuesta.json();
}

async function crearUsuario(nombre) {
  const respuesta = await fetch('/api/usuario', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre })
  });
  return respuesta.json();
}

// --- Perfil ---

async function obtenerPerfil(usuarioId) {
  const respuesta = await fetch(`/api/perfil/${usuarioId}`);
  if (respuesta.status === 404) return null;
  return respuesta.json();
}

async function guardarPerfil(usuarioId, datosPerfil) {
  const respuesta = await fetch(`/api/perfil/${usuarioId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosPerfil)
  });
  return respuesta.json();
}

// --- Objetivos ---

async function obtenerObjetivoActivo(usuarioId) {
  const respuesta = await fetch(`/api/objetivo/${usuarioId}`);
  if (respuesta.status === 404) return null;
  return respuesta.json();
}

async function calcularVistaPreviaObjetivo(usuarioId, tipo) {
  const respuesta = await fetch(`/api/objetivo/${usuarioId}/vista-previa?tipo=${tipo}`);
  return respuesta.json();
}

async function guardarObjetivo(usuarioId, tipo, macrosManuales = null) {
  const respuesta = await fetch(`/api/objetivo/${usuarioId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tipo, macrosManuales })
  });
  return respuesta.json();
}

// --- Alimentos ---

async function buscarAlimentos(texto = '') {
  const respuesta = await fetch(`/api/alimentos?buscar=${encodeURIComponent(texto)}`);
  return respuesta.json();
}

async function crearAlimentoPersonalizado(datos) {
  const respuesta = await fetch('/api/alimentos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...datos, es_personalizado: true })
  });
  return respuesta.json();
}

async function obtenerCategorias() {
  const respuesta = await fetch('/api/categorias');
  return respuesta.json();
}

// --- Recetas ---

async function obtenerRecetas() {
  const respuesta = await fetch('/api/recetas');
  return respuesta.json();
}

async function crearReceta(datos) {
  const respuesta = await fetch('/api/recetas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  return respuesta.json();
}

async function eliminarReceta(id) {
  await fetch(`/api/recetas/${id}`, { method: 'DELETE' });
}

// --- Calendario ---

async function obtenerDia(usuarioId, fechaISO) {
  const respuesta = await fetch(`/api/calendario/dia/${usuarioId}/${fechaISO}`);
  return respuesta.json();
}

async function agregarItemComida(comidaId, datos) {
  const respuesta = await fetch(`/api/calendario/comida/${comidaId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  return respuesta.json();
}

async function eliminarItemComida(itemId) {
  await fetch(`/api/calendario/items/${itemId}`, { method: 'DELETE' });
}
// --- Agua ---

async function obtenerAgua(usuarioId, fechaISO) {
  const respuesta = await fetch(`/api/agua/${usuarioId}/${fechaISO}`);
  return respuesta.json();
}

async function agregarAgua(usuarioId, fechaISO, mililitros) {
  const respuesta = await fetch(`/api/agua/${usuarioId}/${fechaISO}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mililitros })
  });
  return respuesta.json();
}
// --- Inventario ---

async function obtenerInventario(usuarioId) {
  const respuesta = await fetch(`/api/inventario/${usuarioId}`);
  return respuesta.json();
}

async function guardarEnInventario(usuarioId, alimentoId, cantidadGramos) {
  const respuesta = await fetch(`/api/inventario/${usuarioId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ alimento_id: alimentoId, cantidad_gramos: cantidadGramos })
  });
  return respuesta.json();
}

async function ajustarInventario(usuarioId, alimentoId, delta) {
  const respuesta = await fetch(`/api/inventario/${usuarioId}/${alimentoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ delta })
  });
  return respuesta.json();
}

async function eliminarDeInventario(usuarioId, alimentoId) {
  await fetch(`/api/inventario/${usuarioId}/${alimentoId}`, { method: 'DELETE' });
}

async function obtenerNecesidadesSemana(usuarioId, inicioISO, finISO) {
  const respuesta = await fetch(`/api/inventario/${usuarioId}/necesidades?inicio=${inicioISO}&fin=${finISO}`);
  return respuesta.json();
}
// --- Peso ---

async function obtenerHistorialPeso(usuarioId) {
  const respuesta = await fetch(`/api/peso/${usuarioId}`);
  return respuesta.json();
}

async function crearRegistroPeso(usuarioId, datos) {
  const respuesta = await fetch(`/api/peso/${usuarioId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  return respuesta.json();
}

async function eliminarRegistroPeso(id) {
  await fetch(`/api/peso/${id}`, { method: 'DELETE' });
}