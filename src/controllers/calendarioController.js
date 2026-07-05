import {
  obtenerODiaCompleto,
  agregarItemAComida,
  eliminarItemDeComida
} from '../services/calendarioService.js';

export function getDia(req, res) {
  const { usuarioId, fecha } = req.params;
  const dia = obtenerODiaCompleto(usuarioId, fecha);
  res.json(dia);
}

export function postItemComida(req, res) {
  const { comidaId } = req.params;
  const { alimento_id, receta_id, gramos, porciones } = req.body;

  if (!alimento_id && !receta_id) {
    return res.status(400).json({ error: 'Debes indicar un alimento o una receta' });
  }

  if (alimento_id && !gramos) {
    return res.status(400).json({ error: 'Debes indicar los gramos del alimento' });
  }

  agregarItemAComida(comidaId, { alimento_id, receta_id, gramos, porciones });
  res.status(201).json({ mensaje: 'Item agregado correctamente' });
}

export function deleteItemComida(req, res) {
  eliminarItemDeComida(req.params.itemId);
  res.status(204).send();
}