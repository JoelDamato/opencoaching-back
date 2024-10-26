// Importar dependencias
const User = require('../models/Users'); // Importar el modelo de usuario

// Controlador para obtener los datos del usuario por correo electrónico
const getUserDataByEmail = async (req, res) => {
  // Log para confirmar que la solicitud llegó a este controlador
  console.log('Solicitud recibida en el endpoint /api/search/users');
  
  // Log para ver el cuerpo de la solicitud
  console.log('Cuerpo de la solicitud:', req.body);

  try {
    // Obtener el email desde el cuerpo de la solicitud
    const { email } = req.body;

    // Verificar que se haya proporcionado el email
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Buscar el usuario en la base de datos usando el email
    const user = await User.findOne({ email: email });
    console.log('Resultado de la búsqueda del usuario:', user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Enviar los datos del usuario como respuesta
    res.status(200).json({
      nombre: user.nombre,  // Ajustado para que coincida con el campo 'nombre' en el modelo
      email: user.email,
      cursos: user.cursos,
      rol: user.rol,  // Ajustado para que coincida con el campo 'cursos' en el modelo
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Exportar el controlador para obtener los datos del usuario
module.exports = getUserDataByEmail;
