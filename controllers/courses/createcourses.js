const Course = require('../../models/Courses');

// Controlador para crear un curso
const createCourse = async (req, res) => {
  try {
    const { courseTitle, courseDescription, image, chapters } = req.body;

    // Crear un nuevo curso con los datos del request
    const newCourse = new Course({
      courseTitle,
      courseDescription,
      image,
      chapters,
    });

    // Guardar el curso en la base de datos
    const savedCourse = await newCourse.save();

    // Enviar la respuesta con el curso creado
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Error al crear el curso:', error);
    res.status(500).json({ message: 'Hubo un error al crear el curso.' });
  }
};

module.exports = { createCourse };
