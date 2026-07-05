import { obtenerPerfil, guardarPerfil } from '../services/perfilService.js';

export function getPerfil(req, res) {
  const usuarioId = req.params.usuarioId;
  const perfil = obtenerPerfil(usuarioId);

  if (!perfil) {
    return res.status(404).json({ error: 'Perfil no encontrado' });
  }

  res.json(perfil);
}

export function putPerfil(req, res) {
  const usuarioId = req.params.usuarioId;
  const { edad, sexo, altura_cm, peso_actual_kg, nivel_actividad } = req.body;

  if (!edad || !sexo || !altura_cm || !peso_actual_kg || !nivel_actividad) {
    return res.status(400).json({ error: 'Todos los campos del perfil son obligatorios' });
  }

  const perfilActualizado = guardarPerfil(usuarioId, {
    edad, sexo, altura_cm, peso_actual_kg, nivel_actividad
  });

  res.json(perfilActualizado);
}