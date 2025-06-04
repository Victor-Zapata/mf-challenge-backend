// mfnews-backend/routes/news.js
const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// --- Rutas para las noticias ---

// CAMBIO CLAVE AQUÍ: Usa una ruta explícita como '/all' o '/list'
router.get('/all', newsController.getAllNews); // Ahora será /api/all

// Búsqueda de noticias por query y/o autor (ESTA ESTÁ BIEN ASÍ)
router.get('/search', newsController.searchNews); // Será /api/search

// Detalle de una noticia específica (SEGUIRÁ SIENDO /api/:id)
// Asegúrate de que esta esté *después* de '/all' y '/search' si decides mantenerla así.
router.get('/:id', newsController.getNewsById); 

// Crear una nueva noticia (ESTA ESTÁ BIEN ASÍ)
router.post('/', newsController.createNews); // Será /api/

// Actualizar una noticia existente (ESTA ESTÁ BIEN ASÍ)
router.put('/:id', newsController.updateNews); // Será /api/:id

// Eliminar una noticia (ESTA ESTÁ BIEN ASÍ)
router.delete('/:id', newsController.deleteNews); // Será /api/:id

module.exports = router;