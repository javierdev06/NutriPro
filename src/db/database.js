import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// La base de datos vive en la carpeta /database, en la raíz del proyecto
const dbPath = path.join(__dirname, '../../database/nutripro.db');

const db = new DatabaseSync(dbPath);

db.exec('PRAGMA foreign_keys = ON');

function inicializarSchema() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);
  console.log('Base de datos inicializada correctamente');
}

inicializarSchema();

export default db;