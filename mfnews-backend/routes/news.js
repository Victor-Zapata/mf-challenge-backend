const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// --- Rutas para las noticias---

// Búsqueda de noticias por query y/o autor 
router.get('/search', newsController.searchNews);

// Listado de todas las noticias 
router.get('/', newsController.getAllNews);

// Detalle de una noticia específica 
router.get('/:id', newsController.getNewsById);

// Crear una nueva noticia 
router.post('/', newsController.createNews);

// Actualizar una noticia existente 
router.put('/:id', newsController.updateNews);

// Eliminar una noticia 
router.delete('/:id', newsController.deleteNews);

module.exports = router;