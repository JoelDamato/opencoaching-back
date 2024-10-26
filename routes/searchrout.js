const express = require('express');
const getUserDataByEmail = require('../controllers/search.js');


// Crear el router
const router = express.Router();

// Definir la ruta para el registro
router.post('/users', getUserDataByEmail );

module.exports = router;
