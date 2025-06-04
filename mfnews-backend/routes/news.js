// mfnews-backend/routes/news.js
const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// --- Rutas para las noticias ---

// Listado de todas las noticias (PONER ESTA PRIMERO)
router.get('/', newsController.getAllNews);

// Búsqueda de noticias por query y/o autor (ponerla después de la general)
router.get('/search', newsController.searchNews);

// Detalle de una noticia específica (PONER ESTA ÚLTIMO ENTRE LOS GET)
// Esto asegura que '/' y '/search' sean matcheadas antes que '/:id'
router.get('/:id', newsController.getNewsById);

// Crear una nueva noticia 
router.post('/', newsController.createNews);

// Actualizar una noticia existente 
router.put('/:id', newsController.updateNews);

// Eliminar una noticia 
router.delete('/:id', newsController.deleteNews);

module.exports = router;