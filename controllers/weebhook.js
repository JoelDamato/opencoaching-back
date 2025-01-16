const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/webhook', async (req, res) => {
  try {
    const { type, id } = req.body; // `type` es el tipo de notificación (por ejemplo, "payment"), `id` es el identificador.

    console.log('Notificación recibida:', req.body);

    if (type === 'preapproval') {
      // Consultar detalles del preapproval usando el ID
      const response = await axios.get(
        `https://api.mercadopago.com/preapproval/${id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`, // Reemplaza por tu Access Token
          },
        }
      );

      const preapproval = response.data;

      // Verifica el estado y procesa la información
      if (preapproval.status === 'authorized') {
        const externalReference = preapproval.external_reference; // ID del usuario en tu base de datos

        // Actualiza el estado de membresía del usuario en tu base de datos
        const user = await User.findById(externalReference);
        if (user) {
          user.membresia = 1; // Actualiza a la membresía correspondiente
          await user.save();
          console.log(`Membresía actualizada para el usuario con ID: ${externalReference}`);
        } else {
          console.error('Usuario no encontrado en la base de datos.');
        }
      }
    }

    res.status(200).send('OK'); // Respuesta a Mercado Pago para confirmar recepción
  } catch (error) {
    console.error('Error al procesar la notificación:', error);
    res.status(500).send('Error procesando la notificación');
  }
});

module.exports = router;
