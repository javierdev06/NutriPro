import db from '../db/database.js';
import { calcularCaloriasYMacros } from '../utils/calculosNutricionales.js';
import { obtenerPerfil } from './perfilService.js';

export function obtenerObjetivoActivo(usuarioId) {
  const stmt = db.prepare('SELECT * FROM objetivos WHERE usuario_id = ? AND activo = 1');
  return stmt.get(usuarioId);
}

function desactivarObjetivosAnteriores(usuarioId) {
  const stmt = db.prepare(`
    UPDATE objetivos SET activo = 0, fecha_fin = datetime('now')
    WHERE usuario_id = ? AND activo = 1
  `);
  stmt.run(usuarioId);
}

// Calcula calorias y macros SIN guardar, para mostrar una vista previa editable
export function calcularVistaPrevia(usuarioId, tipo) {
  const perfil = obtenerPerfil(usuarioId);
  if (!perfil) {
    throw new Error('Debes completar tu perfil antes de definir un objetivo');
  }
  return calcularCaloriasYMacros(perfil, tipo);
}

export function crearObjetivo(usuarioId, tipo, macrosManuales = null) {
  const perfil = obtenerPerfil(usuarioId);
  if (!perfil) {
    throw new Error('Debes completar tu perfil antes de definir un objetivo');
  }

  const macros = macrosManuales || calcularCaloriasYMacros(perfil, tipo);
  const calculadoAutomaticamente = macrosManuales ? 0 : 1;

  desactivarObjetivosAnteriores(usuarioId);

  const stmt = db.prepare(`
    INSERT INTO objetivos (
      usuario_id, tipo, calorias_objetivo, proteinas_objetivo_g,
      carbohidratos_objetivo_g, grasas_objetivo_g, calculado_automaticamente
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const resultado = stmt.run(
    usuarioId, tipo, macros.calorias, macros.proteinas_g,
    macros.carbohidratos_g, macros.grasas_g, calculadoAutomaticamente
  );

  return obtenerObjetivoPorId(resultado.lastInsertRowid);
}

export function obtenerObjetivoPorId(id) {
  const stmt = db.prepare('SELECT * FROM objetivos WHERE id = ?');
  return stmt.get(id);
}