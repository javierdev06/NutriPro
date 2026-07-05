import db from '../db/database.js';

export function obtenerCategorias() {
  const stmt = db.prepare('SELECT * FROM categorias ORDER BY nombre');
  return stmt.all();
}

export function crearCategoria(nombre) {
  const stmt = db.prepare('INSERT INTO categorias (nombre) VALUES (?)');
  const resultado = stmt.run(nombre);
  return { id: resultado.lastInsertRowid, nombre };
}