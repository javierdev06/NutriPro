async function verificarBackend() {
  const estadoElemento = document.getElementById('estado-backend');
  try {
    const respuesta = await fetch('/api/health');
    const datos = await respuesta.json();
    estadoElemento.textContent = datos.message;
  } catch (error) {
    estadoElemento.textContent = 'No se pudo conectar con el backend';
  }
}

async function crearUsuarioPrueba(nombre) {
  const respuesta = await fetch('/api/usuario', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre })
  });
  return respuesta.json();
}