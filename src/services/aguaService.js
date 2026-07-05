import db from '../db/database.js';

export function obtenerORegistroAgua(usuarioId, fecha) {
  let registro = db.prepare('SELECT * FROM registro_agua WHERE usuario_id = ? AND fecha = ?').get(usuarioId, fecha);

  if (!registro) {
    const stmt = db.prepare('INSERT INTO registro_agua (usuario_id, fecha) VALUES (?, ?)');
    const resultado = stmt.run(usuarioId, fecha);
    registro = { id: resultado.lastInsertRowid, usuario_id: usuarioId, fecha, mililitros: 0, meta_ml: 2000 };
  }

  return registro;
}

export function agregarAgua(usuarioId, fecha, mililitros) {
  const registro = obtenerORegistroAgua(usuarioId, fecha);
  const nuevoTotal = Math.max(0, registro.mililitros + mililitros);

  const stmt = db.prepare('UPDATE registro_agua SET mililitros = ? WHERE id = ?');
  stmt.run(nuevoTotal, registro.id);

  return { ...registro, mililitros: nuevoTotal };
}

export function actualizarMetaAgua(usuarioId, fecha, metaMl) {
  const registro = obtenerORegistroAgua(usuarioId, fecha);
  const stmt = db.prepare('UPDATE registro_agua SET meta_ml = ? WHERE id = ?');
  stmt.run(metaMl, registro.id);
  return { ...registro, meta_ml: metaMl };
}