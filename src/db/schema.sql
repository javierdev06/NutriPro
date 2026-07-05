-- Categorías de alimentos (proteínas, carbohidratos, verduras, etc.)
CREATE TABLE IF NOT EXISTS categorias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE
);

-- Alimentos: valores nutricionales por cada 100g
CREATE TABLE IF NOT EXISTS alimentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  categoria_id INTEGER,
  calorias_100g REAL NOT NULL,
  proteinas_100g REAL NOT NULL,
  carbohidratos_100g REAL NOT NULL,
  grasas_100g REAL NOT NULL,
  fibra_100g REAL DEFAULT 0,
  sodio_100g REAL DEFAULT 0,
  azucar_100g REAL DEFAULT 0,
  es_personalizado INTEGER NOT NULL DEFAULT 0,
  observaciones TEXT,
  creado_en TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
);

-- Índice para acelerar el buscador de alimentos por nombre
CREATE INDEX IF NOT EXISTS idx_alimentos_nombre ON alimentos(nombre);

-- Recetas
CREATE TABLE IF NOT EXISTS recetas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  tiempo_preparacion_min INTEGER,
  instrucciones TEXT,
  creado_en TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Ingredientes de cada receta (relacion receta <-> alimento con su cantidad)
CREATE TABLE IF NOT EXISTS receta_ingredientes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  receta_id INTEGER NOT NULL,
  alimento_id INTEGER NOT NULL,
  gramos REAL NOT NULL,
  FOREIGN KEY (receta_id) REFERENCES recetas(id) ON DELETE CASCADE,
  FOREIGN KEY (alimento_id) REFERENCES alimentos(id) ON DELETE CASCADE
);

-- Días del calendario (con fecha real)
CREATE TABLE IF NOT EXISTS dias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  fecha TEXT NOT NULL,
  UNIQUE(usuario_id, fecha),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Comidas dentro de un día
CREATE TABLE IF NOT EXISTS comidas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dia_id INTEGER NOT NULL,
  tipo TEXT NOT NULL CHECK (
    tipo IN ('desayuno', 'colacion', 'almuerzo', 'merienda', 'once', 'snack_nocturno')
  ),
  FOREIGN KEY (dia_id) REFERENCES dias(id) ON DELETE CASCADE
);

-- Items de una comida: pueden ser un alimento suelto o una receta completa
CREATE TABLE IF NOT EXISTS comida_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  comida_id INTEGER NOT NULL,
  alimento_id INTEGER,
  receta_id INTEGER,
  gramos REAL,
  porciones REAL DEFAULT 1,
  FOREIGN KEY (comida_id) REFERENCES comidas(id) ON DELETE CASCADE,
  FOREIGN KEY (alimento_id) REFERENCES alimentos(id) ON DELETE CASCADE,
  FOREIGN KEY (receta_id) REFERENCES recetas(id) ON DELETE CASCADE,
  CHECK (
    (alimento_id IS NOT NULL AND receta_id IS NULL) OR
    (alimento_id IS NULL AND receta_id IS NOT NULL)
  )
);

-- Registro diario de agua (un registro por dia)
CREATE TABLE IF NOT EXISTS registro_agua (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  fecha TEXT NOT NULL,
  mililitros INTEGER NOT NULL DEFAULT 0,
  meta_ml INTEGER NOT NULL DEFAULT 2000,
  UNIQUE(usuario_id, fecha),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
-- Inventario de alimentos en casa (en gramos)
CREATE TABLE IF NOT EXISTS inventario (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  alimento_id INTEGER NOT NULL,
  cantidad_gramos REAL NOT NULL DEFAULT 0,
  actualizado_en TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(usuario_id, alimento_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (alimento_id) REFERENCES alimentos(id) ON DELETE CASCADE
);
-- Registro historico de peso, grasa corporal y masa muscular
CREATE TABLE IF NOT EXISTS registro_peso (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  peso_kg REAL NOT NULL,
  porcentaje_grasa REAL,
  masa_muscular_kg REAL,
  fecha TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
-- Recordatorios configurables (horarios de comidas y agua)
CREATE TABLE IF NOT EXISTS recordatorios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  tipo TEXT NOT NULL CHECK (
    tipo IN ('desayuno', 'colacion', 'almuerzo', 'merienda', 'once', 'snack_nocturno', 'agua')
  ),
  hora TEXT NOT NULL,
  activo INTEGER NOT NULL DEFAULT 1,
  UNIQUE(usuario_id, tipo),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);