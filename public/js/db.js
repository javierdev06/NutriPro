const NOMBRE_DB = 'NutriProDB';
const VERSION_DB = 2;

function abrirDB() {
  return new Promise((resolve, reject) => {
    const solicitud = indexedDB.open(NOMBRE_DB, VERSION_DB);

    solicitud.onupgradeneeded = (evento) => {
      const db = evento.target.result;

      if (!db.objectStoreNames.contains('usuarios')) {
        db.createObjectStore('usuarios', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('perfil')) {
        db.createObjectStore('perfil', { keyPath: 'usuario_id' });
      }
      if (!db.objectStoreNames.contains('objetivos')) {
        const store = db.createObjectStore('objetivos', { keyPath: 'id', autoIncrement: true });
        store.createIndex('usuario_id', 'usuario_id');
      }
      if (!db.objectStoreNames.contains('categorias')) {
        db.createObjectStore('categorias', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('alimentos')) {
        const store = db.createObjectStore('alimentos', { keyPath: 'id', autoIncrement: true });
        store.createIndex('nombre', 'nombre');
      }
      if (!db.objectStoreNames.contains('recetas')) {
        db.createObjectStore('recetas', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('receta_ingredientes')) {
        const store = db.createObjectStore('receta_ingredientes', { keyPath: 'id', autoIncrement: true });
        store.createIndex('receta_id', 'receta_id');
      }
      if (!db.objectStoreNames.contains('dias')) {
        const store = db.createObjectStore('dias', { keyPath: 'id', autoIncrement: true });
        store.createIndex('usuario_fecha', ['usuario_id', 'fecha'], { unique: true });
      }
      if (!db.objectStoreNames.contains('comidas')) {
        const store = db.createObjectStore('comidas', { keyPath: 'id', autoIncrement: true });
        store.createIndex('dia_id', 'dia_id');
      }
      if (!db.objectStoreNames.contains('comida_items')) {
        const store = db.createObjectStore('comida_items', { keyPath: 'id', autoIncrement: true });
        store.createIndex('comida_id', 'comida_id');
      }
      if (!db.objectStoreNames.contains('registro_agua')) {
        const store = db.createObjectStore('registro_agua', { keyPath: 'id', autoIncrement: true });
        store.createIndex('usuario_fecha', ['usuario_id', 'fecha'], { unique: true });
      }
      if (!db.objectStoreNames.contains('inventario')) {
        const store = db.createObjectStore('inventario', { keyPath: 'id', autoIncrement: true });
        store.createIndex('usuario_alimento', ['usuario_id', 'alimento_id'], { unique: true });
      }
      if (!db.objectStoreNames.contains('registro_peso')) {
        const store = db.createObjectStore('registro_peso', { keyPath: 'id', autoIncrement: true });
        store.createIndex('usuario_id', 'usuario_id');
      }
      if (!db.objectStoreNames.contains('recordatorios')) {
        const store = db.createObjectStore('recordatorios', { keyPath: 'id', autoIncrement: true });
        store.createIndex('usuario_tipo', ['usuario_id', 'tipo'], { unique: true });
      }
      if (!db.objectStoreNames.contains('actividades')) {
        const store = db.createObjectStore('actividades', { keyPath: 'id', autoIncrement: true });
        store.createIndex('usuario_fecha', ['usuario_id', 'fecha']);
      }
      if (!db.objectStoreNames.contains('notas')) {
        const store = db.createObjectStore('notas', { keyPath: 'id', autoIncrement: true });
        store.createIndex('usuario_fecha', ['usuario_id', 'fecha'], { unique: true });
      }
    };

    solicitud.onsuccess = () => resolve(solicitud.result);
    solicitud.onerror = () => reject(solicitud.error);
  });
}

// --- Helpers genericos reutilizables por todos los modulos ---

async function dbAgregar(nombreTienda, objeto) {
  const db = await abrirDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(nombreTienda, 'readwrite');
    const solicitud = tx.objectStore(nombreTienda).add(objeto);
    solicitud.onsuccess = () => resolve({ ...objeto, id: solicitud.result });
    solicitud.onerror = () => reject(solicitud.error);
  });
}

async function dbGuardar(nombreTienda, objeto) {
  const db = await abrirDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(nombreTienda, 'readwrite');
    const solicitud = tx.objectStore(nombreTienda).put(objeto);
    solicitud.onsuccess = () => resolve(objeto);
    solicitud.onerror = () => reject(solicitud.error);
  });
}

async function dbObtenerPorId(nombreTienda, id) {
  const db = await abrirDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(nombreTienda, 'readonly');
    const solicitud = tx.objectStore(nombreTienda).get(id);
    solicitud.onsuccess = () => resolve(solicitud.result || null);
    solicitud.onerror = () => reject(solicitud.error);
  });
}

async function dbObtenerTodos(nombreTienda) {
  const db = await abrirDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(nombreTienda, 'readonly');
    const solicitud = tx.objectStore(nombreTienda).getAll();
    solicitud.onsuccess = () => resolve(solicitud.result);
    solicitud.onerror = () => reject(solicitud.error);
  });
}

async function dbObtenerPorIndice(nombreTienda, nombreIndice, valor) {
  const db = await abrirDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(nombreTienda, 'readonly');
    const indice = tx.objectStore(nombreTienda).index(nombreIndice);
    const solicitud = indice.getAll(valor);
    solicitud.onsuccess = () => resolve(solicitud.result);
    solicitud.onerror = () => reject(solicitud.error);
  });
}

async function dbEliminar(nombreTienda, id) {
  const db = await abrirDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(nombreTienda, 'readwrite');
    const solicitud = tx.objectStore(nombreTienda).delete(id);
    solicitud.onsuccess = () => resolve();
    solicitud.onerror = () => reject(solicitud.error);
  });
}