// mfnews-backend/db/config.js
const { Pool } = require('pg');
const path = require('path');
const dotenv = require('dotenv'); // Asegúrate de requerir dotenv

// Carga las variables de entorno del .env principal PRIMERO
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Si NODE_ENV es 'test', carga el .env.test y SOBRESCRIBE las variables
if (process.env.NODE_ENV === 'test') {
  console.log('Modo TEST: Cargando .env.test y usando DB de prueba.');
  dotenv.config({ path: path.resolve(__dirname, '..', '.env.test'), override: true });
}

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, // Ahora siempre usamos DB_NAME, que será sobrescrito por .env.test en modo test
});

module.exports = pool;