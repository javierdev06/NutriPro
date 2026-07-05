import { obtenerRecordatorios, guardarRecordatorio } from '../services/recordatorioService.js';

const TIPOS_VALIDOS = ['desayuno', 'colacion', 'almuerzo', 'merienda', 'once', 'snack_nocturno', 'agua'];

export function getRecordatorios(req, res) {
  res.json(obtenerRecordatorios(req.params.usuarioId));
}

export function putRecordatorio(req, res) {
  const { usuarioId } = req.params;
  const { tipo, hora, activo } = req.body;

  if (!TIPOS_VALIDOS.includes(tipo) || !hora) {
    return res.status(400).json({ error: 'Tipo u hora invalidos' });
  }

  const recordatorio = guardarRecordatorio(usuarioId, tipo, hora, activo);
  res.json(recordatorio);
}