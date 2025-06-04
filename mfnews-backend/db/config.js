const { Pool } = require('pg');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

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