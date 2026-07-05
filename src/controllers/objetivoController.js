import { obtenerObjetivoActivo, crearObjetivo } from '../services/objetivoService.js';

const TIPOS_VALIDOS = ['ganar_musculo', 'perder_grasa', 'mantener_peso', 'recomposicion'];

export function getObjetivoActivo(req, res) {
  const usuarioId = req.params.usuarioId;
  const objetivo = obtenerObjetivoActivo(usuarioId);

  if (!objetivo) {
    return res.status(404).json({ error: 'No hay un objetivo activo' });
  }

  res.json(objetivo);
}

export function postObjetivo(req, res) {
  const usuarioId = req.params.usuarioId;
  const { tipo, macrosManuales } = req.body;

  if (!TIPOS_VALIDOS.includes(tipo)) {
    return res.status(400).json({ error: 'Tipo de objetivo invalido' });
  }

  try {
    const nuevoObjetivo = crearObjetivo(usuarioId, tipo, macrosManuales);
    res.status(201).json(nuevoObjetivo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}