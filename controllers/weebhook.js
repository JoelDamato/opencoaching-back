const express = require('express');
const axios = require('axios');
const router = express.Router();
const User = require('../models/User'); // Asegúrate de tener este modelo

router.post('/webhook', async (req, res) => {
  try {
    const { type, id } = req.body;

    console.log('Notificación recibida:', req.body);

    if (type === 'preapproval') {
      const response = await axios.get(
        `https://api.mercadopago.com/preapproval/${id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        }
      );

      const preapproval = response.data;

      if (preapproval.status === 'authorized') {
        const externalReference = preapproval.external_reference;

        const user = await User.findById(externalReference);
        if (user) {
          user.membresia = 1;
          await user.save();
          console.log(`Membresía actualizada para el usuario con ID: ${externalReference}`);
        } else {
          console.error('Usuario no encontrado en la base de datos.');
        }
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error al procesar la notificación:', error);
    res.status(500).send('Error procesando la notificación');
  }
});

module.exports = router;
