const express = require('express');
const {
  addComment,
  getCommentsByCourseModuleAndChapter, // Actualizado para incluir moduleName
} = require('../controllers/comments/comments.js'); // Asegúrate de que el path sea correcto
const deleteComment = require('../controllers/comments/delete.js');
const router = express.Router();

// Ruta para agregar un comentario
router.post('/add', addComment);

// Ruta para obtener comentarios por curso, módulo y capítulo
router.get('/:courseId/:moduleName/:chapterId', getCommentsByCourseModuleAndChapter);

// Ruta para eliminar un comentario por ID
router.delete('/:commentId', deleteComment);

module.exports = router;
