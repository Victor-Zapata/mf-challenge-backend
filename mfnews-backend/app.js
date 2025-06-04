const express = require('express');
const cors = require('cors'); 
const pool = require('./db/config'); // pool de conexiones a la DB

// Importa las rutas de noticias que vamos a crear
const newsRoutes = require('./routes/news');

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES GLOBALES
app.use(cors()); // Habilita CORS para permitir peticiones desde el frontend
app.use(express.json()); // Permite a Express leer cuerpos de petición en formato JSON

// MONTAJE DE RUTAS
// Aquí le decimos a Express que use las rutas definidas en newsRoutes para todo lo que empiece con '/api'
app.use('/api/news', newsRoutes);

// ENDPOINT DE PRUEBA 
app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ message: 'Bienvenido a la API de Noticias!', db_time: result.rows[0].now });
    } catch (err) {
        console.error('Error al conectar a la DB:', err);
        res.status(500).json({ error: 'Error interno del servidor al conectar a la DB.' });
    }
});

// MIDDLEWARE PARA ERRORES NO CAPTURADOS (manejo de 404)
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// MIDDLEWARE CENTRALIZADO DE MANEJO DE ERRORES (para errores de servidor 500)
app.use((err, req, res, next) => {
    console.error(err.stack); // Imprime el stack de errores para depuración
    res.status(500).json({ message: 'Algo salió mal en el servidor!', error: err.message });
});


app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

module.exports = app;