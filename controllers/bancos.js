// Importamos las dependencias necesarias
const axios = require('axios');

// Token de la API de Notion
const NOTION_API_TOKEN = 'secret_uCBoeC7cnlFtq7VG4Dr58nBYFLFbR6dKzF00fZt2dq';
// ID de la base de datos de Notion
const DATABASE_ID = 'd03874483db44f498080ad7ffe0b6219';

// Configuración de axios para conectarse con la API de Notion
const notion = axios.create({
  baseURL: 'https://api.notion.com/v1/',
  headers: {
    'Authorization': `Bearer ${NOTION_API_TOKEN}`,
    'Content-Type': 'application/json',
    'Notion-Version': '2022-06-28',
  },
});

// Función para obtener los datos de la base de datos filtrados
const getWesternBanks = async (req, res) => {
  try {
    // Realizamos la solicitud POST para consultar la base de datos
    const response = await notion.post(`/databases/${DATABASE_ID}/query`, {
      filter: {
        property: 'Bancos N',
        rich_text: {
          contains: 'western',
        },
      },
      page_size: 17, // Limitamos el número de resultados para pruebas rápidas
    });

    // Mapeamos los resultados para extraer solo las propiedades necesarias
    const results = response.data.results.map((item) => ({
      nombreBanco: item.properties["Bancos N"]?.title?.[0]?.plain_text || "", // Validación para "Nombre del Banco"
      pais: item.properties["Nacionalidad"]?.select?.name || "", // Validación para "País"
      estadoPagos: item.properties["Estado Datos"]?.formula?.string || "", // Validación para "Estado Pagos"
    }));

    // Enviamos los resultados procesados al cliente
    res.json(results);
  } catch (error) {
    console.error('Error fetching data from Notion:', error.response?.data || error.message);
    res.status(500).send('Error fetching data from Notion');
  }
};

module.exports = getWesternBanks;
