const express = require('express');
const getWesternBanks = require('../controllers/bancos');

// Crear el router
const router = express.Router();

// Definir la ruta específica para 'western-banks'
router.get('/western-banks', getWesternBanks);

module.exports = router;
