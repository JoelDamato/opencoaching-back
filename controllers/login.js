const { Client } = require('@notionhq/client');

// Inicializar cliente de Notion con el token desde variables de entorno
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

// Función para manejar el inicio de sesión
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Consultar la base de datos de Notion para buscar por email (propiedad tipo email)
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Email',
        email: {
          equals: email,
        },
      },
    });

    const user = response.results[0];

    if (!user) {
      return res.status(400).json({ success: false, message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña (propiedad de tipo texto)
    const storedPassword = user.properties.Contraseña.rich_text[0].text.content;

    if (storedPassword !== password) {
      return res.status(400).json({ success: false, message: 'Contraseña incorrecta' });
    }

    return res.status(200).json({ success: true, message: 'Inicio de sesión exitoso' });
  } catch (error) {
    console.error('Error del servidor:', error);
    return res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

module.exports = loginUser;
