const chai = require('chai');
const chaiHttp = require('chai-http');
const pool = require('../db/config'); 

chai.use(chaiHttp);

global.expect = chai.expect;

module.exports = function() {

    before(async function() {
        this.timeout(10000); 
        console.log('Iniciando tests: Verificando conexión a la DB de prueba...');
        try {
            await pool.query('SELECT 1');
            console.log('Conexión a la DB de prueba exitosa.');
        } catch (err) {
            console.error('ERROR: No se pudo conectar a la base de datos de prueba. Asegúrate de que PostgreSQL está corriendo y que .env.test está configurado correctamente.');
            console.error(err);
            process.exit(1); 
        }
    });

    beforeEach(async function() {
        await pool.query('DELETE FROM news;');
        await pool.query('ALTER SEQUENCE news_id_seq RESTART WITH 1;');
    });

    after(async function() {
        console.log('Finalizando tests: Cerrando conexión a la DB de prueba.');
        await pool.end();
        console.log('Conexión a la DB de prueba cerrada.');
    });
};