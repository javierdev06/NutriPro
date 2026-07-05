async function iniciarRevisionRecordatorios() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const usuario = await obtenerUsuario();
  if (!usuario) return;

  const NOMBRES_NOTIFICACION = {
    desayuno: 'Hora del desayuno',
    colacion: 'Hora de la colacion',
    almuerzo: 'Hora del almuerzo',
    merienda: 'Hora de la merienda',
    once: 'Hora de la once',
    snack_nocturno: 'Hora del snack nocturno',
    agua: 'Recuerda tomar agua'
  };

  async function revisar() {
    const recordatorios = await obtenerRecordatorios(usuario.id);
    const ahora = new Date();
    const horaActual = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
    const fechaHoy = formatearFechaISO(ahora);

    for (const rec of recordatorios) {
      if (rec.activo !== 1 || rec.hora !== horaActual) continue;

      const claveNotificado = `notificado_${rec.tipo}_${fechaHoy}`;
      if (localStorage.getItem(claveNotificado)) continue;

      new Notification('NutriPro', {
        body: NOMBRES_NOTIFICACION[rec.tipo] || 'Recordatorio',
        icon: '/assets/icons/icono-notificacion.png'
      });

      localStorage.setItem(claveNotificado, '1');
    }
  }

  revisar();
  setInterval(revisar, 60000);
}

iniciarRevisionRecordatorios();