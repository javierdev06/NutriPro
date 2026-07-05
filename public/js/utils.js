// Devuelve un array con los 7 objetos Date de la semana (Lunes a Domingo) de una fecha dada
function obtenerDiasDeLaSemana(fecha) {
  const diaSemana = fecha.getDay(); // 0 = domingo, 1 = lunes, ...
  const diferenciaHastaLunes = diaSemana === 0 ? -6 : 1 - diaSemana;

  const lunes = new Date(fecha);
  lunes.setDate(fecha.getDate() + diferenciaHastaLunes);

  const dias = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(lunes);
    d.setDate(lunes.getDate() + i);
    dias.push(d);
  }
  return dias;
}

function formatearFechaISO(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

function formatearFechaCorta(fecha) {
  return `${String(fecha.getDate()).padStart(2, '0')}/${String(fecha.getMonth() + 1).padStart(2, '0')}`;
}

const NOMBRES_DIAS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

const NOMBRES_COMIDAS = {
  desayuno: 'Desayuno',
  colacion: 'Colacion',
  almuerzo: 'Almuerzo',
  merienda: 'Merienda',
  once: 'Once',
  snack_nocturno: 'Snack nocturno'
};