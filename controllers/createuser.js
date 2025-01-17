const bcrypt = require('bcrypt');
const User = require('../models/Users'); // Asegúrate de usar la ruta correcta
const mercadopago = require('mercadopago');

const createUser = async (req, res) => {
  try {
    console.log('Cuerpo de la solicitud recibido:', req.body);

    const { 
      nombre, 
      email, 
      password, 
      cursos, 
      membresia, 
      rol, 
      audiencia 
    } = req.body;

    // Validaciones de los datos
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'El formato del email no es válido' });
    }

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

    // Crear el nuevo usuario
    const user = new User({
      nombre,
      email,
      password: hashedPassword,
      cursos: cursos || [],
      membresia: 0,
      rol: rol || 'user',
      audiencia: audiencia || 'Cliente',
    });

    // Guardar el usuario en la base de datos
    await user.save();

    // Si la membresía es mayor a 0 (no gratuita), redirigir a la pasarela de pago
    if (membresia > 0) {
      // Aquí se puede integrar con la API de Mercado Pago para crear un pago
      const preapprovalPlanId = process.env.MERCADOPAGO_PREAPPROVAL_PLAN_ID;
      const subscriptionUrl = `https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=${preapprovalPlanId}`;

      return res.status(201).json({
        message: 'Usuario creado. Redirigiendo a la suscripción.',
        subscriptionUrl, // Enlace directo a la suscripción
      });
    }

    // Respuesta para usuarios con plan gratuito
    return res.status(201).json({ message: 'Usuario creado exitosamente.' });

  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = createUser;


