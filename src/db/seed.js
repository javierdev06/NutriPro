import db from './database.js';

// Categorías base
const categorias = [
  'Proteinas animales',
  'Proteinas vegetales',
  'Carbohidratos',
  'Verduras',
  'Frutas',
  'Lacteos',
  'Grasas y frutos secos',
  'Legumbres',
  'Condimentos y otros'
];

function insertarCategorias() {
  const stmt = db.prepare('INSERT OR IGNORE INTO categorias (nombre) VALUES (?)');
  const idsPorNombre = {};

  for (const nombre of categorias) {
    stmt.run(nombre);
  }

  const filas = db.prepare('SELECT id, nombre FROM categorias').all();
  for (const fila of filas) {
    idsPorNombre[fila.nombre] = fila.id;
  }

  return idsPorNombre;
}

// Alimentos comunes en Chile, valores nutricionales por 100g
function obtenerAlimentosBase(ids) {
  return [
    // Proteinas animales
    { nombre: 'Pechuga de pollo', categoria_id: ids['Proteinas animales'], calorias_100g: 165, proteinas_100g: 31, carbohidratos_100g: 0, grasas_100g: 3.6 },
    { nombre: 'Carne de vacuno (posta)', categoria_id: ids['Proteinas animales'], calorias_100g: 143, proteinas_100g: 26, carbohidratos_100g: 0, grasas_100g: 4 },
    { nombre: 'Salmon', categoria_id: ids['Proteinas animales'], calorias_100g: 208, proteinas_100g: 20, carbohidratos_100g: 0, grasas_100g: 13 },
    { nombre: 'Atun en agua', categoria_id: ids['Proteinas animales'], calorias_100g: 116, proteinas_100g: 26, carbohidratos_100g: 0, grasas_100g: 1 },
    { nombre: 'Pavo (pechuga)', categoria_id: ids['Proteinas animales'], calorias_100g: 135, proteinas_100g: 30, carbohidratos_100g: 0, grasas_100g: 1.7 },
    { nombre: 'Huevo entero', categoria_id: ids['Proteinas animales'], calorias_100g: 155, proteinas_100g: 13, carbohidratos_100g: 1.1, grasas_100g: 11 },
    { nombre: 'Clara de huevo', categoria_id: ids['Proteinas animales'], calorias_100g: 52, proteinas_100g: 11, carbohidratos_100g: 0.7, grasas_100g: 0.2 },
    { nombre: 'Merluza', categoria_id: ids['Proteinas animales'], calorias_100g: 90, proteinas_100g: 18, carbohidratos_100g: 0, grasas_100g: 1.5 },

    // Proteinas vegetales
    { nombre: 'Tofu', categoria_id: ids['Proteinas vegetales'], calorias_100g: 76, proteinas_100g: 8, carbohidratos_100g: 1.9, grasas_100g: 4.8 },
    { nombre: 'Proteina de soya texturizada', categoria_id: ids['Proteinas vegetales'], calorias_100g: 335, proteinas_100g: 52, carbohidratos_100g: 30, grasas_100g: 1 },

    // Carbohidratos
    { nombre: 'Arroz blanco cocido', categoria_id: ids['Carbohidratos'], calorias_100g: 130, proteinas_100g: 2.7, carbohidratos_100g: 28, grasas_100g: 0.3 },
    { nombre: 'Papa cocida', categoria_id: ids['Carbohidratos'], calorias_100g: 87, proteinas_100g: 1.9, carbohidratos_100g: 20, grasas_100g: 0.1 },
    { nombre: 'Fideos cocidos', categoria_id: ids['Carbohidratos'], calorias_100g: 158, proteinas_100g: 5.8, carbohidratos_100g: 31, grasas_100g: 0.9 },
    { nombre: 'Avena cruda', categoria_id: ids['Carbohidratos'], calorias_100g: 389, proteinas_100g: 17, carbohidratos_100g: 66, grasas_100g: 7 },
    { nombre: 'Pan marraqueta', categoria_id: ids['Carbohidratos'], calorias_100g: 274, proteinas_100g: 9, carbohidratos_100g: 54, grasas_100g: 2.5 },
    { nombre: 'Pan integral', categoria_id: ids['Carbohidratos'], calorias_100g: 247, proteinas_100g: 13, carbohidratos_100g: 41, grasas_100g: 3.4 },
    { nombre: 'Quinoa cocida', categoria_id: ids['Carbohidratos'], calorias_100g: 120, proteinas_100g: 4.4, carbohidratos_100g: 21, grasas_100g: 1.9 },
    { nombre: 'Camote cocido', categoria_id: ids['Carbohidratos'], calorias_100g: 90, proteinas_100g: 2, carbohidratos_100g: 21, grasas_100g: 0.1 },

    // Verduras
    { nombre: 'Brocoli', categoria_id: ids['Verduras'], calorias_100g: 34, proteinas_100g: 2.8, carbohidratos_100g: 7, grasas_100g: 0.4 },
    { nombre: 'Espinaca', categoria_id: ids['Verduras'], calorias_100g: 23, proteinas_100g: 2.9, carbohidratos_100g: 3.6, grasas_100g: 0.4 },
    { nombre: 'Zanahoria', categoria_id: ids['Verduras'], calorias_100g: 41, proteinas_100g: 0.9, carbohidratos_100g: 10, grasas_100g: 0.2 },
    { nombre: 'Tomate', categoria_id: ids['Verduras'], calorias_100g: 18, proteinas_100g: 0.9, carbohidratos_100g: 3.9, grasas_100g: 0.2 },
    { nombre: 'Lechuga', categoria_id: ids['Verduras'], calorias_100g: 15, proteinas_100g: 1.4, carbohidratos_100g: 2.9, grasas_100g: 0.2 },
    { nombre: 'Pepino', categoria_id: ids['Verduras'], calorias_100g: 15, proteinas_100g: 0.7, carbohidratos_100g: 3.6, grasas_100g: 0.1 },
    { nombre: 'Zapallo italiano', categoria_id: ids['Verduras'], calorias_100g: 17, proteinas_100g: 1.2, carbohidratos_100g: 3.1, grasas_100g: 0.3 },
    { nombre: 'Cebolla', categoria_id: ids['Verduras'], calorias_100g: 40, proteinas_100g: 1.1, carbohidratos_100g: 9.3, grasas_100g: 0.1 },
    { nombre: 'Pimenton', categoria_id: ids['Verduras'], calorias_100g: 31, proteinas_100g: 1, carbohidratos_100g: 6, grasas_100g: 0.3 },

    // Frutas
    { nombre: 'Platano', categoria_id: ids['Frutas'], calorias_100g: 89, proteinas_100g: 1.1, carbohidratos_100g: 23, grasas_100g: 0.3 },
    { nombre: 'Manzana', categoria_id: ids['Frutas'], calorias_100g: 52, proteinas_100g: 0.3, carbohidratos_100g: 14, grasas_100g: 0.2 },
    { nombre: 'Naranja', categoria_id: ids['Frutas'], calorias_100g: 47, proteinas_100g: 0.9, carbohidratos_100g: 12, grasas_100g: 0.1 },
    { nombre: 'Frutilla', categoria_id: ids['Frutas'], calorias_100g: 32, proteinas_100g: 0.7, carbohidratos_100g: 7.7, grasas_100g: 0.3 },
    { nombre: 'Palta', categoria_id: ids['Frutas'], calorias_100g: 160, proteinas_100g: 2, carbohidratos_100g: 8.5, grasas_100g: 15 },

    // Lacteos
    { nombre: 'Yogurt natural descremado', categoria_id: ids['Lacteos'], calorias_100g: 56, proteinas_100g: 5.7, carbohidratos_100g: 7.7, grasas_100g: 0.2 },
    { nombre: 'Leche descremada', categoria_id: ids['Lacteos'], calorias_100g: 35, proteinas_100g: 3.4, carbohidratos_100g: 5, grasas_100g: 0.1 },
    { nombre: 'Queso fresco', categoria_id: ids['Lacteos'], calorias_100g: 264, proteinas_100g: 18, carbohidratos_100g: 3.4, grasas_100g: 21 },
    { nombre: 'Queso cottage', categoria_id: ids['Lacteos'], calorias_100g: 98, proteinas_100g: 11, carbohidratos_100g: 3.4, grasas_100g: 4.3 },

    // Grasas y frutos secos
    { nombre: 'Aceite de oliva', categoria_id: ids['Grasas y frutos secos'], calorias_100g: 884, proteinas_100g: 0, carbohidratos_100g: 0, grasas_100g: 100 },
    { nombre: 'Almendras', categoria_id: ids['Grasas y frutos secos'], calorias_100g: 579, proteinas_100g: 21, carbohidratos_100g: 22, grasas_100g: 50 },
    { nombre: 'Mani', categoria_id: ids['Grasas y frutos secos'], calorias_100g: 567, proteinas_100g: 26, carbohidratos_100g: 16, grasas_100g: 49 },
    { nombre: 'Nueces', categoria_id: ids['Grasas y frutos secos'], calorias_100g: 654, proteinas_100g: 15, carbohidratos_100g: 14, grasas_100g: 65 },
    { nombre: 'Mantequilla de mani', categoria_id: ids['Grasas y frutos secos'], calorias_100g: 588, proteinas_100g: 25, carbohidratos_100g: 20, grasas_100g: 50 },

    // Legumbres
    { nombre: 'Lentejas cocidas', categoria_id: ids['Legumbres'], calorias_100g: 116, proteinas_100g: 9, carbohidratos_100g: 20, grasas_100g: 0.4 },
    { nombre: 'Garbanzos cocidos', categoria_id: ids['Legumbres'], calorias_100g: 164, proteinas_100g: 8.9, carbohidratos_100g: 27, grasas_100g: 2.6 },
    { nombre: 'Porotos cocidos', categoria_id: ids['Legumbres'], calorias_100g: 127, proteinas_100g: 8.7, carbohidratos_100g: 23, grasas_100g: 0.5 },
  ];
}

function insertarAlimentos(alimentos) {
  const stmt = db.prepare(`
    INSERT INTO alimentos (
      nombre, categoria_id, calorias_100g, proteinas_100g, carbohidratos_100g, grasas_100g
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  let insertados = 0;
  for (const a of alimentos) {
    const existe = db.prepare('SELECT id FROM alimentos WHERE nombre = ?').get(a.nombre);
    if (!existe) {
      stmt.run(a.nombre, a.categoria_id, a.calorias_100g, a.proteinas_100g, a.carbohidratos_100g, a.grasas_100g);
      insertados++;
    }
  }
  return insertados;
}

function ejecutarSeed() {
  console.log('Insertando categorias...');
  const ids = insertarCategorias();
  console.log(`Categorias listas: ${Object.keys(ids).length}`);

  console.log('Insertando alimentos...');
  const alimentos = obtenerAlimentosBase(ids);
  const insertados = insertarAlimentos(alimentos);
  console.log(`Alimentos nuevos insertados: ${insertados}`);
  console.log('Seed completado correctamente');
}

ejecutarSeed();