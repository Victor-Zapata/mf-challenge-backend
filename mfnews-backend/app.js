const express = require('express');
const cors = require('cors'); 
const pool = require('./db/config'); 

const newsRoutes = require('./routes/news');

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: ['http://localhost:5173', 'https://mf-challenge-frontend.onrender.com'], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions)); 

// MIDDLEWARES GLOBALES
app.use(express.json()); 

// MONTAJE DE RUTAS
app.use('/api', newsRoutes); 

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
    console.error(err.stack); 
    res.status(500).json({ message: 'Algo salió mal en el servidor!', error: err.message });
});


app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

module.exports = app;