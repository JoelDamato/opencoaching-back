// Importar los módulos necesarios
const bcrypt = require('bcryptjs');
const User = require('../models/Users'); // Importar el modelo de usuario

// Controlador para editar un usuario
const editUser = async (req, res) => {
  try {
    const { email } = req.params; // Obtener el email de los parámetros
    const { nombre, password, cursos, rol } = req.body; // Obtener datos del cuerpo de la solicitud

    // Validar que el email esté presente
    if (!email) {
      return res.status(400).json({ message: 'El email del usuario es requerido' });
    }

    // Buscar el usuario en la base de datos
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar los campos según los datos proporcionados
    if (nombre) user.nombre = nombre;

    if (password) {
      // Validar la longitud de la nueva contraseña
      if (password.length < 8) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres' });
      }
      // Encriptar la nueva contraseña antes de guardarla
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    if (cursos) {
      // Validar que los cursos sean válidos
      const validCourses = ["Focus", "Master Fade", "Cutting Mastery"];
      const areCoursesValid = cursos.every((course) => validCourses.includes(course));
      if (!areCoursesValid) {
        return res.status(400).json({ message: 'Uno o más cursos no son válidos' });
      }
      user.cursos = cursos;
    }

    if (rol) {
      // Validar que el rol sea válido
      const validRoles = ["user", "admin"];
      if (!validRoles.includes(rol)) {
        return res.status(400).json({ message: 'El rol proporcionado no es válido' });
      }
      user.rol = rol;
    }

    // Guardar los cambios en la base de datos
    await user.save();

    res.status(200).json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Exportar la función
module.exports = editUser;