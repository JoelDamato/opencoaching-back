// Importar los módulos necesarios
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users'); // Importar el modelo de usuario
require('dotenv').config(); // Importar dotenv para manejar variables de entorno

// Controlador para loguear un usuario
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // Cambiado a req.body para manejar correctamente los datos con POST

    // Verificar que los campos requeridos estén presentes
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    // Buscar al usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar un token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Devolver el token al usuario
    res.status(200).json({ message: 'Logeo exitoso', token });
  } catch (error) {
    console.error('Error al hacer login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Exportar la función para ser utilizada en las rutas específicas
module.exports = loginUser;
