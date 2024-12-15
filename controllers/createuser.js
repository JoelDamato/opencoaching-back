const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/Users'); // Importar el modelo de usuario

const createUser = async (req, res) => {
  try {
    console.log('Cuerpo de la solicitud recibido:', req.body);

    const { nombre, email, password, cursos, rol } = req.body;

    // Validaciones de campos
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' });
    }

    // Validar el formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'El formato del email no es válido' });
    }

    // Validar longitud de la contraseña
    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
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
      rol: rol || 'user',
    });

    await user.save();

    // Configurar el transporte de Nodemailer con SMTP GoDaddy
    const transporter = nodemailer.createTransport({
      host: 'smtpout.secureserver.net', // Servidor SMTP de GoDaddy
      port: 587, // Puerto STARTTLS (usar 465 si es SSL)
      secure: false, // false para STARTTLS, true para SSL
      auth: {
        user: 'contacto@erickgomezacademy.com', // Tu correo
        pass: 'Gopitchering2024', // Tu contraseña
      },
      debug: true, // Mostrar logs de depuración
      logger: true, // Habilitar logs detallados
    });

    // Configurar las opciones del correo
    const mailOptions = {
      from: '"Erick Gomez Academy" <contacto@erickgomezacademy.com>',
      to: email, // Correo del usuario registrado
      subject: '¡Bienvenido a Erick Gomez Academy!',
      html: `
        <h1>Hola, ${nombre} 👋</h1>
        <p>Gracias por registrarte en <strong>Erick Gomez Academy</strong>. ¡Nos alegra tenerte con nosotros!</p>
        <p>Explora nuestros cursos y no dudes en contactarnos si tienes alguna consulta.</p>
        <br />
        <p>Saludos,<br />El equipo de Erick Gomez Academy 🚀</p>
      `,
    };

    // Enviar el correo de bienvenida
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error al enviar el correo:', err);
        return res
          .status(500)
          .json({ message: 'Usuario creado, pero hubo un error al enviar el correo.' });
      }
      console.log('Correo enviado con éxito:', info.messageId);
      return res
        .status(201)
        .json({ message: 'Usuario creado exitosamente. Se envió un correo de bienvenida.' });
    });
  } catch (error) {
    console.error('Error al crear el usuario o enviar el correo:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = createUser;
