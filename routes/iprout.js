const express = require('express');
const { checkIPs } = require('../controllers/verificarip');

// Crear el router
const router = express.Router();

// Definir la ruta para el registro
router.post('/check-ips', checkIPs);

module.exports = router;


