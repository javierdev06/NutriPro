import db from '../db/database.js';

export function obtenerPerfil(usuarioId) {
  const stmt = db.prepare('SELECT * FROM perfil WHERE usuario_id = ?');
  return stmt.get(usuarioId);
}

export function guardarPerfil(usuarioId, datos) {
  const { edad, sexo, altura_cm, peso_actual_kg, nivel_actividad } = datos;
  const perfilExistente = obtenerPerfil(usuarioId);

  if (perfilExistente) {
    const stmt = db.prepare(`
      UPDATE perfil
      SET edad = ?, sexo = ?, altura_cm = ?, peso_actual_kg = ?, nivel_actividad = ?,
          actualizado_en = datetime('now')
      WHERE usuario_id = ?
    `);
    stmt.run(edad, sexo, altura_cm, peso_actual_kg, nivel_actividad, usuarioId);
  } else {
    const stmt = db.prepare(`
      INSERT INTO perfil (usuario_id, edad, sexo, altura_cm, peso_actual_kg, nivel_actividad)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(usuarioId, edad, sexo, altura_cm, peso_actual_kg, nivel_actividad);
  }

  return obtenerPerfil(usuarioId);
}