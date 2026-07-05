import db from '../db/database.js';

export function obtenerRecetas() {
  const stmt = db.prepare('SELECT * FROM recetas ORDER BY nombre');
  const recetas = stmt.all();
  return recetas.map(receta => ({
    ...receta,
    macros: calcularMacrosDeReceta(receta.id)
  }));
}

export function obtenerRecetaPorId(id) {
  const receta = db.prepare('SELECT * FROM recetas WHERE id = ?').get(id);
  if (!receta) return null;

  const ingredientes = obtenerIngredientesDeReceta(id);
  const macros = calcularMacrosDeReceta(id);

  return { ...receta, ingredientes, macros };
}

export function obtenerIngredientesDeReceta(recetaId) {
  const stmt = db.prepare(`
    SELECT ri.id, ri.gramos, a.id AS alimento_id, a.nombre AS alimento_nombre,
           a.calorias_100g, a.proteinas_100g, a.carbohidratos_100g, a.grasas_100g
    FROM receta_ingredientes ri
    JOIN alimentos a ON ri.alimento_id = a.id
    WHERE ri.receta_id = ?
  `);
  return stmt.all(recetaId);
}

// Suma los macros de todos los ingredientes, proporcional a los gramos usados
export function calcularMacrosDeReceta(recetaId) {
  const ingredientes = obtenerIngredientesDeReceta(recetaId);

  const totales = ingredientes.reduce((acumulado, ing) => {
    const factor = ing.gramos / 100;
    acumulado.calorias += ing.calorias_100g * factor;
    acumulado.proteinas_g += ing.proteinas_100g * factor;
    acumulado.carbohidratos_g += ing.carbohidratos_100g * factor;
    acumulado.grasas_g += ing.grasas_100g * factor;
    return acumulado;
  }, { calorias: 0, proteinas_g: 0, carbohidratos_g: 0, grasas_g: 0 });

  return {
    calorias: Math.round(totales.calorias),
    proteinas_g: Math.round(totales.proteinas_g * 10) / 10,
    carbohidratos_g: Math.round(totales.carbohidratos_g * 10) / 10,
    grasas_g: Math.round(totales.grasas_g * 10) / 10
  };
}

export function crearReceta(datos) {
  const { nombre, descripcion, tiempo_preparacion_min, instrucciones, ingredientes } = datos;

  const stmt = db.prepare(`
    INSERT INTO recetas (nombre, descripcion, tiempo_preparacion_min, instrucciones)
    VALUES (?, ?, ?, ?)
  `);
  const resultado = stmt.run(nombre, descripcion || null, tiempo_preparacion_min || null, instrucciones || null);
  const recetaId = resultado.lastInsertRowid;

  if (ingredientes && ingredientes.length > 0) {
    agregarIngredientes(recetaId, ingredientes);
  }

  return obtenerRecetaPorId(recetaId);
}

export function agregarIngredientes(recetaId, ingredientes) {
  const stmt = db.prepare(`
    INSERT INTO receta_ingredientes (receta_id, alimento_id, gramos)
    VALUES (?, ?, ?)
  `);

  for (const ing of ingredientes) {
    stmt.run(recetaId, ing.alimento_id, ing.gramos);
  }
}

export function eliminarReceta(id) {
  const stmt = db.prepare('DELETE FROM recetas WHERE id = ?');
  stmt.run(id);
}