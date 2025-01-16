const express = require('express');
const { crearCurso } = require('../controllers/courses/createcourses');
const { getCourses } = require('../controllers/courses/getcourses');

// Crear el router
const router = express.Router();

// Definir las rutas para los cursos
router.post('/create', crearCurso);
router.get('/getcourses', getCourses);

module.exports = router;
