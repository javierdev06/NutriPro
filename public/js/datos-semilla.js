const CATEGORIAS_SEMILLA = [
  'Proteinas animales', 'Proteinas vegetales', 'Carbohidratos', 'Verduras',
  'Frutas', 'Lacteos', 'Grasas y frutos secos', 'Legumbres', 'Condimentos y otros'
];

const ALIMENTOS_SEMILLA = [
  { nombre: 'Pechuga de pollo', categoria: 'Proteinas animales', calorias_100g: 165, proteinas_100g: 31, carbohidratos_100g: 0, grasas_100g: 3.6 },
  { nombre: 'Carne de vacuno (posta)', categoria: 'Proteinas animales', calorias_100g: 143, proteinas_100g: 26, carbohidratos_100g: 0, grasas_100g: 4 },
  { nombre: 'Salmon', categoria: 'Proteinas animales', calorias_100g: 208, proteinas_100g: 20, carbohidratos_100g: 0, grasas_100g: 13 },
  { nombre: 'Atun en agua', categoria: 'Proteinas animales', calorias_100g: 116, proteinas_100g: 26, carbohidratos_100g: 0, grasas_100g: 1 },
  { nombre: 'Pavo (pechuga)', categoria: 'Proteinas animales', calorias_100g: 135, proteinas_100g: 30, carbohidratos_100g: 0, grasas_100g: 1.7 },
  { nombre: 'Huevo entero', categoria: 'Proteinas animales', calorias_100g: 155, proteinas_100g: 13, carbohidratos_100g: 1.1, grasas_100g: 11 },
  { nombre: 'Clara de huevo', categoria: 'Proteinas animales', calorias_100g: 52, proteinas_100g: 11, carbohidratos_100g: 0.7, grasas_100g: 0.2 },
  { nombre: 'Merluza', categoria: 'Proteinas animales', calorias_100g: 90, proteinas_100g: 18, carbohidratos_100g: 0, grasas_100g: 1.5 },
  { nombre: 'Tofu', categoria: 'Proteinas vegetales', calorias_100g: 76, proteinas_100g: 8, carbohidratos_100g: 1.9, grasas_100g: 4.8 },
  { nombre: 'Proteina de soya texturizada', categoria: 'Proteinas vegetales', calorias_100g: 335, proteinas_100g: 52, carbohidratos_100g: 30, grasas_100g: 1 },
  { nombre: 'Arroz blanco cocido', categoria: 'Carbohidratos', calorias_100g: 130, proteinas_100g: 2.7, carbohidratos_100g: 28, grasas_100g: 0.3 },
  { nombre: 'Papa cocida', categoria: 'Carbohidratos', calorias_100g: 87, proteinas_100g: 1.9, carbohidratos_100g: 20, grasas_100g: 0.1 },
  { nombre: 'Fideos cocidos', categoria: 'Carbohidratos', calorias_100g: 158, proteinas_100g: 5.8, carbohidratos_100g: 31, grasas_100g: 0.9 },
  { nombre: 'Avena cruda', categoria: 'Carbohidratos', calorias_100g: 389, proteinas_100g: 17, carbohidratos_100g: 66, grasas_100g: 7 },
  { nombre: 'Pan marraqueta', categoria: 'Carbohidratos', calorias_100g: 274, proteinas_100g: 9, carbohidratos_100g: 54, grasas_100g: 2.5 },
  { nombre: 'Pan integral', categoria: 'Carbohidratos', calorias_100g: 247, proteinas_100g: 13, carbohidratos_100g: 41, grasas_100g: 3.4 },
  { nombre: 'Quinoa cocida', categoria: 'Carbohidratos', calorias_100g: 120, proteinas_100g: 4.4, carbohidratos_100g: 21, grasas_100g: 1.9 },
  { nombre: 'Camote cocido', categoria: 'Carbohidratos', calorias_100g: 90, proteinas_100g: 2, carbohidratos_100g: 21, grasas_100g: 0.1 },
  { nombre: 'Brocoli', categoria: 'Verduras', calorias_100g: 34, proteinas_100g: 2.8, carbohidratos_100g: 7, grasas_100g: 0.4 },
  { nombre: 'Espinaca', categoria: 'Verduras', calorias_100g: 23, proteinas_100g: 2.9, carbohidratos_100g: 3.6, grasas_100g: 0.4 },
  { nombre: 'Zanahoria', categoria: 'Verduras', calorias_100g: 41, proteinas_100g: 0.9, carbohidratos_100g: 10, grasas_100g: 0.2 },
  { nombre: 'Tomate', categoria: 'Verduras', calorias_100g: 18, proteinas_100g: 0.9, carbohidratos_100g: 3.9, grasas_100g: 0.2 },
  { nombre: 'Lechuga', categoria: 'Verduras', calorias_100g: 15, proteinas_100g: 1.4, carbohidratos_100g: 2.9, grasas_100g: 0.2 },
  { nombre: 'Pepino', categoria: 'Verduras', calorias_100g: 15, proteinas_100g: 0.7, carbohidratos_100g: 3.6, grasas_100g: 0.1 },
  { nombre: 'Zapallo italiano', categoria: 'Verduras', calorias_100g: 17, proteinas_100g: 1.2, carbohidratos_100g: 3.1, grasas_100g: 0.3 },
  { nombre: 'Cebolla', categoria: 'Verduras', calorias_100g: 40, proteinas_100g: 1.1, carbohidratos_100g: 9.3, grasas_100g: 0.1 },
  { nombre: 'Pimenton', categoria: 'Verduras', calorias_100g: 31, proteinas_100g: 1, carbohidratos_100g: 6, grasas_100g: 0.3 },
  { nombre: 'Platano', categoria: 'Frutas', calorias_100g: 89, proteinas_100g: 1.1, carbohidratos_100g: 23, grasas_100g: 0.3 },
  { nombre: 'Manzana', categoria: 'Frutas', calorias_100g: 52, proteinas_100g: 0.3, carbohidratos_100g: 14, grasas_100g: 0.2 },
  { nombre: 'Naranja', categoria: 'Frutas', calorias_100g: 47, proteinas_100g: 0.9, carbohidratos_100g: 12, grasas_100g: 0.1 },
  { nombre: 'Frutilla', categoria: 'Frutas', calorias_100g: 32, proteinas_100g: 0.7, carbohidratos_100g: 7.7, grasas_100g: 0.3 },
  { nombre: 'Palta', categoria: 'Frutas', calorias_100g: 160, proteinas_100g: 2, carbohidratos_100g: 8.5, grasas_100g: 15 },
  { nombre: 'Yogurt natural descremado', categoria: 'Lacteos', calorias_100g: 56, proteinas_100g: 5.7, carbohidratos_100g: 7.7, grasas_100g: 0.2 },
  { nombre: 'Leche descremada', categoria: 'Lacteos', calorias_100g: 35, proteinas_100g: 3.4, carbohidratos_100g: 5, grasas_100g: 0.1 },
  { nombre: 'Queso fresco', categoria: 'Lacteos', calorias_100g: 264, proteinas_100g: 18, carbohidratos_100g: 3.4, grasas_100g: 21 },
  { nombre: 'Queso cottage', categoria: 'Lacteos', calorias_100g: 98, proteinas_100g: 11, carbohidratos_100g: 3.4, grasas_100g: 4.3 },
  { nombre: 'Aceite de oliva', categoria: 'Grasas y frutos secos', calorias_100g: 884, proteinas_100g: 0, carbohidratos_100g: 0, grasas_100g: 100 },
  { nombre: 'Almendras', categoria: 'Grasas y frutos secos', calorias_100g: 579, proteinas_100g: 21, carbohidratos_100g: 22, grasas_100g: 50 },
  { nombre: 'Mani', categoria: 'Grasas y frutos secos', calorias_100g: 567, proteinas_100g: 26, carbohidratos_100g: 16, grasas_100g: 49 },
  { nombre: 'Nueces', categoria: 'Grasas y frutos secos', calorias_100g: 654, proteinas_100g: 15, carbohidratos_100g: 14, grasas_100g: 65 },
  { nombre: 'Mantequilla de mani', categoria: 'Grasas y frutos secos', calorias_100g: 588, proteinas_100g: 25, carbohidratos_100g: 20, grasas_100g: 50 },
  { nombre: 'Lentejas cocidas', categoria: 'Legumbres', calorias_100g: 116, proteinas_100g: 9, carbohidratos_100g: 20, grasas_100g: 0.4 },
  { nombre: 'Garbanzos cocidos', categoria: 'Legumbres', calorias_100g: 164, proteinas_100g: 8.9, carbohidratos_100g: 27, grasas_100g: 2.6 },
  { nombre: 'Porotos cocidos', categoria: 'Legumbres', calorias_100g: 127, proteinas_100g: 8.7, carbohidratos_100g: 23, grasas_100g: 0.5 }
];

// Se ejecuta una sola vez: si ya hay alimentos cargados, no hace nada
async function sembrarDatosSiEsNecesario() {
  const alimentosExistentes = await dbObtenerTodos('alimentos');
  if (alimentosExistentes.length > 0) return;

  const idsCategorias = {};
  for (const nombre of CATEGORIAS_SEMILLA) {
    const categoria = await dbAgregar('categorias', { nombre });
    idsCategorias[nombre] = categoria.id;
  }

  for (const alimento of ALIMENTOS_SEMILLA) {
    await dbAgregar('alimentos', {
      nombre: alimento.nombre,
      categoria_id: idsCategorias[alimento.categoria],
      calorias_100g: alimento.calorias_100g,
      proteinas_100g: alimento.proteinas_100g,
      carbohidratos_100g: alimento.carbohidratos_100g,
      grasas_100g: alimento.grasas_100g,
      fibra_100g: 0,
      sodio_100g: 0,
      azucar_100g: 0,
      es_personalizado: 0,
      observaciones: null,
      creado_en: new Date().toISOString()
    });
  }

  console.log('Datos semilla cargados en IndexedDB');
}