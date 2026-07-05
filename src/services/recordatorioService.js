import db from '../db/database.js';

export function obtenerRecordatorios(usuarioId) {
  const stmt = db.prepare('SELECT * FROM recordatorios WHERE usuario_id = ? ORDER BY hora');
  return stmt.all(usuarioId);
}

export function guardarRecordatorio(usuarioId, tipo, hora, activo) {
  const stmt = db.prepare(`
    INSERT INTO recordatorios (usuario_id, tipo, hora, activo)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(usuario_id, tipo)
    DO UPDATE SET hora = excluded.hora, activo = excluded.activo
  `);
  stmt.run(usuarioId, tipo, hora, activo ? 1 : 0);

  return db.prepare('SELECT * FROM recordatorios WHERE usuario_id = ? AND tipo = ?').get(usuarioId, tipo);
}