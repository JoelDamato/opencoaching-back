const express = require('express');
const createUser = require('../controllers/createuser');

// Crear el router
const router = express.Router();

// Definir la ruta para el registro
router.post('/register', createUser);

module.exports = router;
