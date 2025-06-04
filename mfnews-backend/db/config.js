const { Pool } = require('pg');
const path = require('path');
const dotenv = require('dotenv'); 

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

if (process.env.NODE_ENV === 'test') {
  console.log('Modo TEST: Cargando .env.test y usando DB de prueba.');
  dotenv.config({ path: path.resolve(__dirname, '..', '.env.test'), override: true });
}

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, 
});

module.exports = pool;