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