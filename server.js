import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './src/db/database.js';
import usuarioRoutes from './src/routes/usuarioRoutes.js';
import perfilRoutes from './src/routes/perfilRoutes.js';
import objetivoRoutes from './src/routes/objetivoRoutes.js';
import categoriaRoutes from './src/routes/categoriaRoutes.js';
import alimentoRoutes from './src/routes/alimentoRoutes.js';
import recetaRoutes from './src/routes/recetaRoutes.js';
import calendarioRoutes from './src/routes/calendarioRoutes.js';
import aguaRoutes from './src/routes/aguaRoutes.js';
import inventarioRoutes from './src/routes/inventarioRoutes.js';
import pesoRoutes from './src/routes/pesoRoutes.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Sirve los archivos del frontend (carpeta public)
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de la API
app.use('/api/usuario', usuarioRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/objetivo', objetivoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/alimentos', alimentoRoutes);
app.use('/api/recetas', recetaRoutes);
app.use('/api/calendario', calendarioRoutes);
app.use('/api/agua', aguaRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/peso', pesoRoutes);

// Ruta de prueba de la API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend funcionando correctamente' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});