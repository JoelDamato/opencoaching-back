const { createCanvas, loadImage } = require('canvas');

// Controlador para generar imagen
const generateImage = async (req, res) => {
  const { name, imageUrl } = req.body;
  if (!name) {
    return res.status(400).send('Nombre no proporcionado');
  }
  if (!imageUrl) {
    return res.status(400).send('URL de la imagen no proporcionada');
  }

  try {
    // Cargar la imagen de fondo
    const image = await loadImage(imageUrl);

    // Crear un canvas y un contexto de dibujo
    const width = 800;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Dibujar la imagen de fondo
    ctx.drawImage(image, 0, 0, width, height);


    // Estilo del texto
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 50px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Insertar el nombre en el centro de la imagen
    ctx.fillText(name, width / 2, height / 2 + 10);

    // Convertir el canvas a un buffer de imagen
    const buffer = canvas.toBuffer('image/png');

    // Enviar la imagen generada como respuesta
    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);
  } catch (error) {
    console.error('Error al cargar la imagen:', error);
    res.status(500).send('Error al generar la imagen');
  }
};

module.exports = 
generateImage

