// Importar los módulos necesarios
const express = require('express');
const editUser = require('../controllers/updateuser');

// Crear el router
const router = express.Router();

// Definir la ruta para editar un usuario
router.put('/users/:email', editUser);

module.exports = router;