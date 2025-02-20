const express = require('express');
const {getSuscripciones  } = require('../controllers/pagos'); // Importa la función del controlador

const router = express.Router();

// Definir la ruta para obtener todos los pagos
router.get('/', getSuscripciones);

module.exports = router;
