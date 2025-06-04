const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// --- Rutas para las noticias ---

// Listado de todas las noticias (RUTA MÁS GENERAL)
router.get('/', newsController.getAllNews);

// Búsqueda de noticias por query y/o autor
router.get('/search', newsController.searchNews);

// Detalle de una noticia específica (RUTA CON PARÁMETRO)
router.get('/:id', newsController.getNewsById);

// Crear, Actualizar y Eliminar Noticias
router.post('/', newsController.createNews);
router.put('/:id', newsController.updateNews);
router.delete('/:id', newsController.deleteNews);

module.exports = router;