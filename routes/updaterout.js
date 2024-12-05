// Importar los módulos necesarios
const express = require('express');
const editUser = require('../controllers/updateuser');
const editUser2 = require('../controllers/editpassword');

// Crear el router
const router = express.Router();

// Definir la ruta para editar un usuario
router.put('/users/:email', editUser);
router.put('/password/:email', editUser2);

module.exports = router;