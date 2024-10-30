const Comment = require('../../models/Comments'); // Ajusta la ruta si necesitas retroceder más carpetas

const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const deletedComment = await Comment.findOneAndDelete({ _id: commentId });
    if (!deletedComment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }
    res.status(200).json({ message: 'Comentario borrado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al borrar comentario', error });
  }
};

module.exports = deleteComment;
