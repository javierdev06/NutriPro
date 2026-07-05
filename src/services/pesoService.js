import db from '../db/database.js';

export function obtenerHistorialPeso(usuarioId) {
  const stmt = db.prepare(`
    SELECT * FROM registro_peso
    WHERE usuario_id = ?
    ORDER BY fecha ASC
  `);
  return stmt.all(usuarioId);
}

export function obtenerUltimoRegistro(usuarioId) {
  const stmt = db.prepare(`
    SELECT * FROM registro_peso
    WHERE usuario_id = ?
    ORDER BY fecha DESC
    LIMIT 1
  `);
  return stmt.get(usuarioId);
}

export function crearRegistroPeso(usuarioId, datos) {
  const { peso_kg, porcentaje_grasa, masa_muscular_kg } = datos;

  const stmt = db.prepare(`
    INSERT INTO registro_peso (usuario_id, peso_kg, porcentaje_grasa, masa_muscular_kg)
    VALUES (?, ?, ?, ?)
  `);
  const resultado = stmt.run(usuarioId, peso_kg, porcentaje_grasa || null, masa_muscular_kg || null);

  // Mantiene el perfil sincronizado con el peso mas reciente
  db.prepare('UPDATE perfil SET peso_actual_kg = ? WHERE usuario_id = ?').run(peso_kg, usuarioId);

  return db.prepare('SELECT * FROM registro_peso WHERE id = ?').get(resultado.lastInsertRowid);
}

export function eliminarRegistroPeso(id) {
  const stmt = db.prepare('DELETE FROM registro_peso WHERE id = ?');
  stmt.run(id);
}