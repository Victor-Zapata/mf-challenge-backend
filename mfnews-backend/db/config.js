// mfnews-backend/db/config.js
const { Pool } = require('pg');
const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno principales desde .env (para desarrollo local)
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Si estamos en modo de prueba, sobrescribir con .env.test
if (process.env.NODE_ENV === 'test') {
  console.log('Modo TEST: Cargando .env.test y usando DB de prueba.');
  dotenv.config({ path: path.resolve(__dirname, '..', '.env.test'), override: true });
}

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({

    connectionString: connectionString,
    user: connectionString ? undefined : process.env.DB_USER,      
    host: connectionString ? undefined : process.env.DB_HOST,      
    port: connectionString ? undefined : (process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432), 
    password: connectionString ? undefined : process.env.DB_PASSWORD, 
    database: connectionString ? undefined : process.env.DB_NAME,   

    ssl: connectionString ? { rejectUnauthorized: false } : false 
});


pool.connect((err, client, release) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.stack);

    } else {
        console.log('Conexión exitosa a la base de datos');
        release(); 
    }
});

module.exports = pool;
