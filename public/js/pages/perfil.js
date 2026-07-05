const formulario = document.getElementById('form-perfil');
const mensaje = document.getElementById('mensaje-perfil');

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const edad = Number(document.getElementById('edad').value);
  const sexo = document.getElementById('sexo').value;
  const altura_cm = Number(document.getElementById('altura').value);
  const peso_actual_kg = Number(document.getElementById('peso').value);
  const nivel_actividad = document.getElementById('actividad').value;

  try {
    let usuario = await obtenerUsuario();

    if (!usuario) {
      usuario = await crearUsuario(nombre);
    }

    await guardarPerfil(usuario.id, {
      edad, sexo, altura_cm, peso_actual_kg, nivel_actividad
    });

    mensaje.textContent = 'Perfil guardado correctamente';
    mensaje.classList.remove('error');
  } catch (error) {
    mensaje.textContent = 'Ocurrio un error al guardar el perfil';
    mensaje.classList.add('error');
  }
});