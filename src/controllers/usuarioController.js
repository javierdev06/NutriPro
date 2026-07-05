import { crearUsuario, obtenerUsuario } from '../services/usuarioService.js';

export function postUsuario(req, res) {
  const { nombre } = req.body;

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }

  const usuarioExistente = obtenerUsuario();
  if (usuarioExistente) {
    return res.status(400).json({ error: 'Ya existe un usuario registrado' });
  }

  const nuevoUsuario = crearUsuario(nombre.trim());
  res.status(201).json(nuevoUsuario);
}

export function getUsuario(req, res) {
  const usuario = obtenerUsuario();

  if (!usuario) {
    return res.status(404).json({ error: 'No hay usuario registrado todavia' });
  }

  res.json(usuario);
}