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

// Render automáticamente inyecta DATABASE_URL si conectas tu DB Render a tu servicio.
// Esta es la forma preferida de conectar en producción.
// Si DATABASE_URL existe, la usaremos; de lo contrario, usaremos variables separadas.
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    // Si connectionString existe (ej. en Render), úsala.
    // De lo contrario, usa las variables individuales (ej. para local/test).
    connectionString: connectionString,
    user: connectionString ? undefined : process.env.DB_USER,      // Solo si no hay connectionString
    host: connectionString ? undefined : process.env.DB_HOST,      // Solo si no hay connectionString
    port: connectionString ? undefined : (process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432), // Solo si no hay connectionString
    password: connectionString ? undefined : process.env.DB_PASSWORD, // Solo si no hay connectionString
    database: connectionString ? undefined : process.env.DB_NAME,   // Solo si no hay connectionString

    // *** MUY IMPORTANTE PARA Render: Configuración SSL ***
    // Render requiere SSL para las conexiones a sus bases de datos.
    // 'rejectUnauthorized: false' es común en entornos de desarrollo/staging o si el certificado
    // no es estrictamente validado (aunque en producción es mejor con validación).
    // Para Render, suele ser necesario si la DB y el Web Service están en la misma región.
    ssl: connectionString ? { rejectUnauthorized: false } : false // Habilitar SSL solo si usamos connectionString (producción en Render)
});

// Prueba la conexión a la base de datos al iniciar el servidor
// Esto es útil para depurar si la conexión falla al inicio.
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.stack);
        // Si la base de datos es esencial, puedes forzar la salida del proceso.
        // process.exit(1); 
    } else {
        console.log('Conexión exitosa a la base de datos');
        release(); // Libera el cliente de vuelta al pool
    }
});

module.exports = pool;


//antes despliegue
// const { Pool } = require('pg');
// const path = require('path');
// const dotenv = require('dotenv'); 

// dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// if (process.env.NODE_ENV === 'test') {
//   console.log('Modo TEST: Cargando .env.test y usando DB de prueba.');
//   dotenv.config({ path: path.resolve(__dirname, '..', '.env.test'), override: true });
// }

// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME, 
// });

// module.exports = pool;