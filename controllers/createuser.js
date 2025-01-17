const bcrypt = require('bcrypt');
const User = require('../models/Users'); // Ruta al modelo de usuario
const mercadopago = require('mercadopago');

// Configura el token de acceso de Mercado Pago
mercadopago.configurations.setAccessToken(process.env.MERCADOPAGO_ACCESS_TOKEN);

const createUser = async (req, res) => {
  try {
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
    const savedUser = await user.save();

    // Si la membresía es mayor a 0 (requiere pago), generar el enlace de suscripción
    if (membresia > 0) {
      const preapprovalPlanId = process.env.MERCADOPAGO_PREAPPROVAL_PLAN_ID;
      const subscriptionUrl = `https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=${preapprovalPlanId}&external_reference=${savedUser._id}`;

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

// Endpoint para verificar el pago
const verifyPayment = async (req, res) => {
  try {
    const { userId } = req.query; // Se recibe el ID del usuario desde la consulta

    if (!userId) {
      return res.status(400).json({ message: 'El ID del usuario es requerido.' });
    }

    // Buscar pagos relacionados al usuario en Mercado Pago
    const searchResult = await mercadopago.payment.search({
      qs: {
        external_reference: userId, // Buscar pagos por el ID del usuario
      },
    });

    const payment = searchResult.body.results.find(
      (p) => p.external_reference === userId && p.status === 'approved'
    );

    if (payment) {
      const user = await User.findById(userId);
      if (user) {
        user.membresia = 1; // Actualizar membresía a 1
        await user.save();
        return res.status(200).json({ message: 'Pago verificado y membresía actualizada.' });
      } else {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
    } else {
      return res.status(400).json({ message: 'Pago no aprobado o no encontrado.' });
    }
  } catch (error) {
    console.error('Error al verificar el pago:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  createUser,
  verifyPayment,
};
