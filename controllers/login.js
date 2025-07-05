// Importar los módulos necesarios
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
require('dotenv').config();

// Controlador para loguear un usuario
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Logeo exitoso',
      token,
      nombre: user.nombre,
      rol: user.rol,
      membresia: user.membresia, // <- ✅ ahora se guarda correctamente
    });
  } catch (error) {
    console.error('Error al hacer login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = loginUser;
