// mfnews-backend/db/config.js
require('dotenv').config(); // Carga las variables de entorno desde .env

const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'admin',
    host: process.env.DB_HOST || 'localhost', // 'localhost' si usas Docker Desktop directamente sin una red bridge específica
    database: process.env.DB_NAME || 'mfnews_db',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

// Función para testear la conexión
pool.on('connect', () => {
    console.log('Conectado a la base de datos PostgreSQL.');
});

pool.on('error', (err) => {
    console.error('Error inesperado en el cliente de PostgreSQL', err);
    process.exit(-1); // Termina la aplicación si hay un error crítico en la DB.
});

module.exports = pool;