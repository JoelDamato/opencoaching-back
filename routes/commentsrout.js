const express = require('express');
const { addComment, getCommentsByCourseAndChapter } = require('../controllers/comments/comments.js'); // Asegúrate de que el path sea correcto
const deleteComment = require('../controllers/comments/delete.js'); 
const router = express.Router();

// Ruta para agregar un comentario
router.post('/add', addComment);
router.get('/:courseId/:chapterId', getCommentsByCourseAndChapter);
router.delete('/:commentId', deleteComment);

module.exports = router;

