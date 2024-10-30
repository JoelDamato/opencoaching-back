const Comment = require('../../models/Comments'); // Ajusta la ruta si necesitas retroceder más carpetas

// Controlador para agregar un comentario
const addComment = async (req, res) => {
  const { courseId, chapterId, userEmail, content } = req.body;

  try {
    const comment = new Comment({ courseId, chapterId, userEmail, content });
    await comment.save();
    res.status(201).json({ message: 'Comentario agregado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar comentario', error });
  }
};

// Controlador para obtener comentarios por curso y capítulo
const getCommentsByCourseAndChapter = async (req, res) => {
  const { courseId, chapterId } = req.params;

  try {
    const comments = await Comment.find({ courseId, chapterId });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener comentarios', error });
  }
};

module.exports = {
  addComment,
  getCommentsByCourseAndChapter,
};
