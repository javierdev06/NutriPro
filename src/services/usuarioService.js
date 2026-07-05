import db from '../db/database.js';

// Crea el usuario único de la aplicación (solo se usa una vez)
export function crearUsuario(nombre) {
  const stmt = db.prepare('INSERT INTO usuarios (nombre) VALUES (?)');
  const resultado = stmt.run(nombre);
  return { id: resultado.lastInsertRowid, nombre };
}

// Obtiene el primer usuario registrado (por ahora la app es de un solo usuario)
export function obtenerUsuario() {
  const stmt = db.prepare('SELECT * FROM usuarios LIMIT 1');
  return stmt.get();
}