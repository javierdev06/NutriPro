import { obtenerORegistroAgua, agregarAgua, actualizarMetaAgua } from '../services/aguaService.js';

export function getAgua(req, res) {
  const { usuarioId, fecha } = req.params;
  res.json(obtenerORegistroAgua(usuarioId, fecha));
}

export function postAgua(req, res) {
  const { usuarioId, fecha } = req.params;
  const { mililitros } = req.body;

  if (mililitros == null) {
    return res.status(400).json({ error: 'Debes indicar los mililitros' });
  }

  res.json(agregarAgua(usuarioId, fecha, mililitros));
}

export function putMetaAgua(req, res) {
  const { usuarioId, fecha } = req.params;
  const { meta_ml } = req.body;

  if (!meta_ml) {
    return res.status(400).json({ error: 'Debes indicar la meta en mililitros' });
  }

  res.json(actualizarMetaAgua(usuarioId, fecha, meta_ml));
}