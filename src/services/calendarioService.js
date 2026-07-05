import db from '../db/database.js';
import { calcularMacrosDeReceta } from './recetaService.js';

const TIPOS_COMIDA = ['desayuno', 'colacion', 'almuerzo', 'merienda', 'once', 'snack_nocturno'];

// Obtiene un día con todas sus comidas e items, creando el día si no existe
export function obtenerODiaCompleto(usuarioId, fecha) {
  let dia = db.prepare('SELECT * FROM dias WHERE usuario_id = ? AND fecha = ?').get(usuarioId, fecha);

  if (!dia) {
    const stmt = db.prepare('INSERT INTO dias (usuario_id, fecha) VALUES (?, ?)');
    const resultado = stmt.run(usuarioId, fecha);
    dia = { id: resultado.lastInsertRowid, usuario_id: usuarioId, fecha };

    // Crea automáticamente las 6 comidas vacías del día
    const stmtComida = db.prepare('INSERT INTO comidas (dia_id, tipo) VALUES (?, ?)');
    for (const tipo of TIPOS_COMIDA) {
      stmtComida.run(dia.id, tipo);
    }
  }

  return obtenerDiaConDetalle(dia.id);
}

export function obtenerDiaConDetalle(diaId) {
  const dia = db.prepare('SELECT * FROM dias WHERE id = ?').get(diaId);
  if (!dia) return null;

  const comidas = db.prepare('SELECT * FROM comidas WHERE dia_id = ?').all(diaId);

  const comidasConItems = comidas.map(comida => {
    const items = obtenerItemsDeComida(comida.id);
    const macros = sumarMacros(items);
    return { ...comida, items, macros };
  });

  const macrosDelDia = sumarMacros(comidasConItems.flatMap(c => c.items));

  return { ...dia, comidas: comidasConItems, macrosDelDia };
}

export function obtenerItemsDeComida(comidaId) {
  const stmt = db.prepare(`
    SELECT
      ci.id, ci.gramos, ci.porciones,
      a.id AS alimento_id, a.nombre AS alimento_nombre,
      a.calorias_100g, a.proteinas_100g, a.carbohidratos_100g, a.grasas_100g,
      r.id AS receta_id, r.nombre AS receta_nombre
    FROM comida_items ci
    LEFT JOIN alimentos a ON ci.alimento_id = a.id
    LEFT JOIN recetas r ON ci.receta_id = r.id
    WHERE ci.comida_id = ?
  `);

  return stmt.all(comidaId).map(item => ({
    ...item,
    macros: calcularMacrosDeItem(item)
  }));
}

function calcularMacrosDeItem(item) {
  if (item.alimento_id) {
    const factor = item.gramos / 100;
    return {
      calorias: Math.round(item.calorias_100g * factor),
      proteinas_g: Math.round(item.proteinas_100g * factor * 10) / 10,
      carbohidratos_g: Math.round(item.carbohidratos_100g * factor * 10) / 10,
      grasas_g: Math.round(item.grasas_100g * factor * 10) / 10
    };
  }

  if (item.receta_id) {
    const macrosBase = calcularMacrosDeReceta(item.receta_id);
    return {
      calorias: Math.round(macrosBase.calorias * item.porciones),
      proteinas_g: Math.round(macrosBase.proteinas_g * item.porciones * 10) / 10,
      carbohidratos_g: Math.round(macrosBase.carbohidratos_g * item.porciones * 10) / 10,
      grasas_g: Math.round(macrosBase.grasas_g * item.porciones * 10) / 10
    };
  }

  return { calorias: 0, proteinas_g: 0, carbohidratos_g: 0, grasas_g: 0 };
}

function sumarMacros(items) {
  return items.reduce((acc, item) => {
    acc.calorias += item.macros.calorias;
    acc.proteinas_g += item.macros.proteinas_g;
    acc.carbohidratos_g += item.macros.carbohidratos_g;
    acc.grasas_g += item.macros.grasas_g;
    return acc;
  }, { calorias: 0, proteinas_g: 0, carbohidratos_g: 0, grasas_g: 0 });
}

export function agregarItemAComida(comidaId, datos) {
  const { alimento_id, receta_id, gramos, porciones } = datos;

  const stmt = db.prepare(`
    INSERT INTO comida_items (comida_id, alimento_id, receta_id, gramos, porciones)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(
    comidaId,
    alimento_id || null,
    receta_id || null,
    gramos || null,
    porciones || 1
  );
}

export function eliminarItemDeComida(itemId) {
  const stmt = db.prepare('DELETE FROM comida_items WHERE id = ?');
  stmt.run(itemId);
}