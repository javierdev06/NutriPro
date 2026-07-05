import {
  obtenerInventario,
  establecerCantidad,
  ajustarCantidad,
  eliminarDelInventario,
  calcularNecesidadesSemana
} from '../services/inventarioService.js';

export function getInventario(req, res) {
  res.json(obtenerInventario(req.params.usuarioId));
}

export function postInventario(req, res) {
  const { alimento_id, cantidad_gramos } = req.body;

  if (!alimento_id || cantidad_gramos == null) {
    return res.status(400).json({ error: 'Debes indicar el alimento y la cantidad' });
  }

  establecerCantidad(req.params.usuarioId, alimento_id, cantidad_gramos);
  res.status(201).json({ mensaje: 'Inventario actualizado' });
}

export function putAjusteInventario(req, res) {
  const { usuarioId, alimentoId } = req.params;
  const { delta } = req.body;

  if (delta == null) {
    return res.status(400).json({ error: 'Debes indicar el delta a ajustar' });
  }

  const nuevaCantidad = ajustarCantidad(usuarioId, alimentoId, delta);
  res.json({ cantidad_gramos: nuevaCantidad });
}

export function deleteInventario(req, res) {
  eliminarDelInventario(req.params.usuarioId, req.params.alimentoId);
  res.status(204).send();
}

export function getNecesidadesSemana(req, res) {
  const { usuarioId } = req.params;
  const { inicio, fin } = req.query;

  if (!inicio || !fin) {
    return res.status(400).json({ error: 'Debes indicar fecha de inicio y fin' });
  }

  res.json(calcularNecesidadesSemana(usuarioId, inicio, fin));
}