// Importar los módulos necesarios
const bcrypt = require('bcryptjs');
const User = require('../models/Users'); // Importar el modelo de usuario

// Controlador para editar un usuario
const editUser = async (req, res) => {
  try {
    console.log('Cuerpo de la solicitud recibido para edición:', req.body); // Ver qué datos llegan realmente

    const { email } = req.params;
    const { nombre, password, cursos, rol } = req.body;

    // Verificar que el email del usuario esté presente
    if (!email) {
      return res.status(400).json({ message: 'El email del usuario es requerido' });
    }

    // Buscar el usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar los campos del usuario si están presentes en la solicitud
    if (nombre) user.nombre = nombre;
    if (password) {
      // Encriptar la nueva contraseña si se proporciona
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    if (cursos) user.cursos = cursos;
    if (rol) user.rol = rol;

    // Guardar los cambios en la base de datos
    await user.save();

    res.status(200).json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Exportar la función para ser utilizada en las rutas específicas
module.exports = editUser;
