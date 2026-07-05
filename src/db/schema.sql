-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  creado_en TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Perfil físico del usuario
CREATE TABLE IF NOT EXISTS perfil (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  edad INTEGER,
  sexo TEXT CHECK (sexo IN ('masculino', 'femenino', 'otro')),
  altura_cm REAL,
  peso_actual_kg REAL,
  nivel_actividad TEXT CHECK (
    nivel_actividad IN ('sedentario', 'ligero', 'moderado', 'activo', 'muy_activo')
  ),
  actualizado_en TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Objetivos del usuario (se guarda historial, no se sobrescribe)
CREATE TABLE IF NOT EXISTS objetivos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  tipo TEXT NOT NULL CHECK (
    tipo IN ('ganar_musculo', 'perder_grasa', 'mantener_peso', 'recomposicion')
  ),
  calorias_objetivo INTEGER NOT NULL,
  proteinas_objetivo_g REAL NOT NULL,
  carbohidratos_objetivo_g REAL NOT NULL,
  grasas_objetivo_g REAL NOT NULL,
  calculado_automaticamente INTEGER NOT NULL DEFAULT 1,
  fecha_inicio TEXT NOT NULL DEFAULT (datetime('now')),
  fecha_fin TEXT,
  activo INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);