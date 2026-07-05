import { obtenerAlimentos, obtenerAlimentoPorId, crearAlimento } from '../services/alimentoService.js';

export function getAlimentos(req, res) {
  const busqueda = req.query.buscar || '';
  res.json(obtenerAlimentos(busqueda));
}

export function getAlimentoPorId(req, res) {
  const alimento = obtenerAlimentoPorId(req.params.id);

  if (!alimento) {
    return res.status(404).json({ error: 'Alimento no encontrado' });
  }

  res.json(alimento);
}

export function postAlimento(req, res) {
  const { nombre, calorias_100g, proteinas_100g, carbohidratos_100g, grasas_100g } = req.body;

  if (!nombre || calorias_100g == null || proteinas_100g == null || carbohidratos_100g == null || grasas_100g == null) {
    return res.status(400).json({ error: 'Nombre, calorias, proteinas, carbohidratos y grasas son obligatorios' });
  }

  const nuevoAlimento = crearAlimento(req.body);
  res.status(201).json(nuevoAlimento);
}