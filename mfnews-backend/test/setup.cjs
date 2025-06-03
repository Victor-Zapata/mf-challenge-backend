// mfnews-backend/test/setup.cjs

// Importaciones necesarias
const chai = require('chai');
const chaiHttp = require('chai-http');
const pool = require('../db/config'); // Asegúrate de que esta ruta es correcta

// Configura Chai para usar chai-http
chai.use(chaiHttp);

// Haz 'expect' globalmente disponible para que no tengas que importarlo en cada test
global.expect = chai.expect;

// Exportamos una función que Mocha ejecutará cuando se cargue este archivo.
// Esto asegura que los hooks de Mocha estén disponibles en el scope correcto.
module.exports = function() {
    // Define hooks globales para la limpieza de la DB
    // before: se ejecuta una vez antes de todos los tests
    // beforeEach: se ejecuta antes de CADA test
    // after: se ejecuta una vez después de todos los tests

    before(async function() {
        // Aumenta el timeout para el hook before si la conexión a la DB tarda
        this.timeout(10000); // 10 segundos para la conexión inicial
        console.log('Iniciando tests: Verificando conexión a la DB de prueba...');
        try {
            await pool.query('SELECT 1');
            console.log('Conexión a la DB de prueba exitosa.');
        } catch (err) {
            console.error('ERROR: No se pudo conectar a la base de datos de prueba. Asegúrate de que PostgreSQL está corriendo y que .env.test está configurado correctamente.');
            console.error(err);
            process.exit(1); // Sale si no puede conectar a la DB de prueba
        }
    });

    beforeEach(async function() {
        // Asegúrate de que esta línea esté correcta para reiniciar la secuencia
        await pool.query('DELETE FROM news;');
        await pool.query('ALTER SEQUENCE news_id_seq RESTART WITH 1;');
    });

    after(async function() {
        console.log('Finalizando tests: Cerrando conexión a la DB de prueba.');
        await pool.end();
        console.log('Conexión a la DB de prueba cerrada.');
    });
};