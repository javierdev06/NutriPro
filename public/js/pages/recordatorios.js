const TIPOS_RECORDATORIO = [
  { tipo: 'desayuno', nombre: 'Desayuno', horaDefault: '08:00' },
  { tipo: 'colacion', nombre: 'Colacion', horaDefault: '11:00' },
  { tipo: 'almuerzo', nombre: 'Almuerzo', horaDefault: '14:00' },
  { tipo: 'merienda', nombre: 'Merienda', horaDefault: '17:00' },
  { tipo: 'once', nombre: 'Once', horaDefault: '19:00' },
  { tipo: 'snack_nocturno', nombre: 'Snack nocturno', horaDefault: '21:00' },
  { tipo: 'agua', nombre: 'Recordatorio de agua', horaDefault: '12:00' }
];

const listaRecordatorios = document.getElementById('lista-recordatorios');
const mensajePermiso = document.getElementById('mensaje-permiso');
const btnActivarNotificaciones = document.getElementById('btn-activar-notificaciones');

let usuarioActual = null;

async function inicializarRecordatorios() {
  usuarioActual = await obtenerUsuario();

  if (!usuarioActual) {
    listaRecordatorios.innerHTML = '<p class="mensaje error">Primero debes crear tu perfil</p>';
    return;
  }

  actualizarEstadoPermiso();

  const existentes = await obtenerRecordatorios(usuarioActual.id);
  renderizarRecordatorios(existentes);
}

function actualizarEstadoPermiso() {
  if (!('Notification' in window)) {
    mensajePermiso.textContent = 'Tu navegador no soporta notificaciones';
    mensajePermiso.classList.add('error');
    btnActivarNotificaciones.style.display = 'none';
    return;
  }

  if (Notification.permission === 'granted') {
    mensajePermiso.textContent = 'Notificaciones activadas';
    mensajePermiso.classList.remove('error');
    btnActivarNotificaciones.style.display = 'none';
  } else {
    mensajePermiso.textContent = 'Activa las notificaciones para recibir tus recordatorios';
  }
}

btnActivarNotificaciones.addEventListener('click', async () => {
  await Notification.requestPermission();
  actualizarEstadoPermiso();
});

function renderizarRecordatorios(existentes) {
  listaRecordatorios.innerHTML = '';

  for (const config of TIPOS_RECORDATORIO) {
    const existente = existentes.find(r => r.tipo === config.tipo);
    const hora = existente ? existente.hora : config.horaDefault;
    const activo = existente ? existente.activo === 1 : false;

    const fila = document.createElement('div');
    fila.className = 'fila-recordatorio';
    fila.innerHTML = `
      <span>${config.nombre}</span>
      <input type="time" value="${hora}" data-tipo="${config.tipo}" class="input-hora-recordatorio">
      <input type="checkbox" ${activo ? 'checked' : ''} data-tipo="${config.tipo}" class="check-activo-recordatorio">
    `;
    listaRecordatorios.appendChild(fila);
  }

  document.querySelectorAll('.input-hora-recordatorio, .check-activo-recordatorio').forEach(input => {
    input.addEventListener('change', guardarCambios);
  });
}

async function guardarCambios(evento) {
  const tipo = evento.target.dataset.tipo;
  const fila = evento.target.closest('.fila-recordatorio');
  const hora = fila.querySelector('.input-hora-recordatorio').value;
  const activo = fila.querySelector('.check-activo-recordatorio').checked;

  await guardarRecordatorio(usuarioActual.id, tipo, hora, activo);
}

inicializarRecordatorios();