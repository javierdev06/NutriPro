import db from '../db/database.js';

export function obtenerAlimentos(busqueda = '') {
  if (busqueda) {
    const stmt = db.prepare(`
      SELECT a.*, c.nombre AS categoria_nombre
      FROM alimentos a
      LEFT JOIN categorias c ON a.categoria_id = c.id
      WHERE a.nombre LIKE ?
      ORDER BY a.nombre
    `);
    return stmt.all(`%${busqueda}%`);
  }

  const stmt = db.prepare(`
    SELECT a.*, c.nombre AS categoria_nombre
    FROM alimentos a
    LEFT JOIN categorias c ON a.categoria_id = c.id
    ORDER BY a.nombre
  `);
  return stmt.all();
}

export function obtenerAlimentoPorId(id) {
  const stmt = db.prepare('SELECT * FROM alimentos WHERE id = ?');
  return stmt.get(id);
}

export function crearAlimento(datos) {
  const {
    nombre, categoria_id, calorias_100g, proteinas_100g,
    carbohidratos_100g, grasas_100g, fibra_100g,
    sodio_100g, azucar_100g, es_personalizado, observaciones
  } = datos;

  const stmt = db.prepare(`
    INSERT INTO alimentos (
      nombre, categoria_id, calorias_100g, proteinas_100g,
      carbohidratos_100g, grasas_100g, fibra_100g,
      sodio_100g, azucar_100g, es_personalizado, observaciones
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const resultado = stmt.run(
    nombre, categoria_id || null, calorias_100g, proteinas_100g,
    carbohidratos_100g, grasas_100g, fibra_100g || 0,
    sodio_100g || 0, azucar_100g || 0, es_personalizado ? 1 : 0,
    observaciones || null
  );

  return obtenerAlimentoPorId(resultado.lastInsertRowid);
}