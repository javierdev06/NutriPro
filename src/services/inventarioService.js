import db from '../db/database.js';
import { obtenerIngredientesDeReceta } from './recetaService.js';

export function obtenerInventario(usuarioId) {
  const stmt = db.prepare(`
    SELECT i.id, i.alimento_id, i.cantidad_gramos, a.nombre AS alimento_nombre
    FROM inventario i
    JOIN alimentos a ON i.alimento_id = a.id
    WHERE i.usuario_id = ?
    ORDER BY a.nombre
  `);
  return stmt.all(usuarioId);
}

export function establecerCantidad(usuarioId, alimentoId, cantidadGramos) {
  const stmt = db.prepare(`
    INSERT INTO inventario (usuario_id, alimento_id, cantidad_gramos)
    VALUES (?, ?, ?)
    ON CONFLICT(usuario_id, alimento_id)
    DO UPDATE SET cantidad_gramos = excluded.cantidad_gramos, actualizado_en = datetime('now')
  `);
  stmt.run(usuarioId, alimentoId, cantidadGramos);
}

export function ajustarCantidad(usuarioId, alimentoId, deltaGramos) {
  const actual = db.prepare(
    'SELECT cantidad_gramos FROM inventario WHERE usuario_id = ? AND alimento_id = ?'
  ).get(usuarioId, alimentoId);

  const nuevaCantidad = Math.max(0, (actual ? actual.cantidad_gramos : 0) + deltaGramos);
  establecerCantidad(usuarioId, alimentoId, nuevaCantidad);
  return nuevaCantidad;
}

export function eliminarDelInventario(usuarioId, alimentoId) {
  const stmt = db.prepare('DELETE FROM inventario WHERE usuario_id = ? AND alimento_id = ?');
  stmt.run(usuarioId, alimentoId);
}

// Calcula cuanto se necesita de cada alimento segun el plan de una semana,
// comparando con lo que ya existe en el inventario
export function calcularNecesidadesSemana(usuarioId, fechaInicio, fechaFin) {
  const necesidades = {};

  const itemsAlimento = db.prepare(`
    SELECT ci.alimento_id, ci.gramos
    FROM dias d
    JOIN comidas c ON c.dia_id = d.id
    JOIN comida_items ci ON ci.comida_id = c.id
    WHERE d.usuario_id = ? AND d.fecha BETWEEN ? AND ? AND ci.alimento_id IS NOT NULL
  `).all(usuarioId, fechaInicio, fechaFin);

  for (const item of itemsAlimento) {
    necesidades[item.alimento_id] = (necesidades[item.alimento_id] || 0) + item.gramos;
  }

  const itemsReceta = db.prepare(`
    SELECT ci.receta_id, ci.porciones
    FROM dias d
    JOIN comidas c ON c.dia_id = d.id
    JOIN comida_items ci ON ci.comida_id = c.id
    WHERE d.usuario_id = ? AND d.fecha BETWEEN ? AND ? AND ci.receta_id IS NOT NULL
  `).all(usuarioId, fechaInicio, fechaFin);

  for (const item of itemsReceta) {
    const ingredientes = obtenerIngredientesDeReceta(item.receta_id);
    for (const ing of ingredientes) {
      const gramosUsados = ing.gramos * item.porciones;
      necesidades[ing.alimento_id] = (necesidades[ing.alimento_id] || 0) + gramosUsados;
    }
  }

  const resultado = [];
  for (const [alimentoId, gramosNecesarios] of Object.entries(necesidades)) {
    const alimento = db.prepare('SELECT nombre FROM alimentos WHERE id = ?').get(alimentoId);
    const inv = db.prepare(
      'SELECT cantidad_gramos FROM inventario WHERE usuario_id = ? AND alimento_id = ?'
    ).get(usuarioId, alimentoId);

    const disponible = inv ? inv.cantidad_gramos : 0;
    const faltante = Math.max(0, gramosNecesarios - disponible);

    resultado.push({
      alimento_id: Number(alimentoId),
      nombre: alimento.nombre,
      necesario_gramos: Math.round(gramosNecesarios),
      disponible_gramos: Math.round(disponible),
      faltante_gramos: Math.round(faltante)
    });
  }

  return resultado.sort((a, b) => b.faltante_gramos - a.faltante_gramos);
}