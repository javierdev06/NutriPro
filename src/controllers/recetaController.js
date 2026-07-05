import { obtenerRecetas, obtenerRecetaPorId, crearReceta, eliminarReceta } from '../services/recetaService.js';

export function getRecetas(req, res) {
  res.json(obtenerRecetas());
}

export function getRecetaPorId(req, res) {
  const receta = obtenerRecetaPorId(req.params.id);

  if (!receta) {
    return res.status(404).json({ error: 'Receta no encontrada' });
  }

  res.json(receta);
}

export function postReceta(req, res) {
  const { nombre, ingredientes } = req.body;

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre de la receta es obligatorio' });
  }

  if (!ingredientes || ingredientes.length === 0) {
    return res.status(400).json({ error: 'La receta debe tener al menos un ingrediente' });
  }

  const nuevaReceta = crearReceta(req.body);
  res.status(201).json(nuevaReceta);
}

export function deleteReceta(req, res) {
  eliminarReceta(req.params.id);
  res.status(204).send();
}