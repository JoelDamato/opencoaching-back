const axios = require('axios');

// Configurar cliente de Mercado Pago
const mercadopagoApi = axios.create({
  baseURL: 'https://api.mercadopago.com',
  headers: {
    Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// Controlador para buscar suscripciones
const getSuscripciones = async (req, res) => {
  try {
    // Extraer y validar parámetros de la solicitud
    let { limit = 30, offset = 0, status, sort } = req.query;

    // Validar y ajustar valores de limit y offset
    limit = Math.min(parseInt(limit), 300); // Máximo 300 resultados por página
    offset = Math.max(parseInt(offset), 0); // No permitir valores negativos

    // Construir los parámetros de la consulta
    const params = { limit, offset };

    if (status) params.status = status; // Filtrar por estado de la suscripción
    if (sort) params.sort = sort;       // Ordenar los resultados (e.g., 'date_created:desc')

    // Llamar a la API de Mercado Pago
    const response = await mercadopagoApi.get('/preapproval/search', { params });

    // Procesar los resultados obtenidos
    const { paging, results } = response.data;

    // Formatear los resultados para mayor claridad
    const formattedResults = results.map((subscription) => ({
      id: subscription.id,
      estado: subscription.status,
      razon: subscription.reason,
      fecha_creacion: subscription.date_created,
      ultima_modificacion: subscription.last_modified,
      monto_total_cobrado: subscription.summarized?.charged_amount || 0,
      monto_total_pendiente: subscription.summarized?.pending_charge_amount || 0,
      ultima_fecha_cobro: subscription.summarized?.last_charged_date || null,
      ultima_cantidad_cobrada: subscription.summarized?.last_charged_amount || 0,
      proximo_pago: subscription.next_payment_date || null,
      metodo_pago: subscription.payment_method_id,
      cliente: {
        nombre: subscription.payer_first_name,
        apellido: subscription.payer_last_name,
      },
      referencia_externa: subscription.external_reference,
      enlace_pago: subscription.init_point || null,
    }));

    // Responder con los resultados formateados
    return res.status(200).json({
      mensaje: formattedResults.length
        ? 'Suscripciones obtenidas exitosamente'
        : 'No se encontraron suscripciones',
      total: paging.total,
      limite: paging.limit,
      offset: paging.offset,
      suscripciones: formattedResults,
    });

  } catch (error) {
    // Manejo de errores
    console.error('Error al obtener las suscripciones:', error.response?.data || error.message);

    // Definir mensaje de error según el tipo de fallo
    const statusCode = error.response?.status || 500;
    const errorMessage =
      statusCode === 401
        ? 'Token de autenticación inválido o expirado'
        : 'Error al obtener las suscripciones';

    return res.status(statusCode).json({ mensaje: errorMessage });
  }
};

// Exportar el controlador
module.exports = {
  getSuscripciones,
};
