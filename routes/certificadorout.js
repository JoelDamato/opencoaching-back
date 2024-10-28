const express = require('express');
const generateImage = require('../controllers/certificados.js'); 
const router = express.Router();

// Definir la ruta para generar la imagen
router.post('/generate-image', generateImage);

module.exports = router;
