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