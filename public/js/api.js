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