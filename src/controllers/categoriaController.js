import { obtenerCategorias, crearCategoria } from '../services/categoriaService.js';

export function getCategorias(req, res) {
  res.json(obtenerCategorias());
}

export function postCategoria(req, res) {
  const { nombre } = req.body;

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre de la categoria es obligatorio' });
  }

  const nuevaCategoria = crearCategoria(nombre.trim());
  res.status(201).json(nuevaCategoria);
}