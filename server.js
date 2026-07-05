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

// Ruta de prueba de la API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend funcionando correctamente' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});