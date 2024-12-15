const User = require('../models/Users'); // Asegúrate de que el path sea correcto

// Controlador para borrar un usuario por email
const deleteUserByEmail = async (req, res) => {
  try {
    const { email } = req.body; // Obtener el email del usuario del cuerpo de la solicitud

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Eliminar el usuario
    await User.findOneAndDelete({ email });

    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error al eliminar el usuario', error });
  }
};

module.exports = { deleteUserByEmail };
