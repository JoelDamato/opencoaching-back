// Importar los módulos necesarios
const bcrypt = require('bcryptjs');
const User = require('../models/Users'); // Importar el modelo de usuario

// Controlador para crear un usuario
const createUser = async (req, res) => {
  try {
    console.log('Cuerpo de la solicitud recibido:', req.body); // Ver qué datos llegan realmente

    const { nombre, email, password, cursos, rol } = req.body;

    // Verificar que los campos requeridos estén presentes
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya está registrado' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const user = new User({
      nombre,
      email,
      password: hashedPassword,
      cursos: cursos || [],
      rol: rol || "user",
    });

    // Guardar el usuario en la base de datos
    await user.save();

    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Exportar la función para ser utilizada en las rutas específicas
module.exports = createUser;
