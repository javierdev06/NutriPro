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