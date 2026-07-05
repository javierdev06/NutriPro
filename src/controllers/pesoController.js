import {
  obtenerHistorialPeso,
  crearRegistroPeso,
  eliminarRegistroPeso
} from '../services/pesoService.js';

export function getHistorialPeso(req, res) {
  res.json(obtenerHistorialPeso(req.params.usuarioId));
}

export function postRegistroPeso(req, res) {
  const { peso_kg, porcentaje_grasa, masa_muscular_kg } = req.body;

  if (!peso_kg) {
    return res.status(400).json({ error: 'El peso es obligatorio' });
  }

  const nuevoRegistro = crearRegistroPeso(req.params.usuarioId, {
    peso_kg, porcentaje_grasa, masa_muscular_kg
  });

  res.status(201).json(nuevoRegistro);
}

export function deleteRegistroPeso(req, res) {
  eliminarRegistroPeso(req.params.id);
  res.status(204).send();
}