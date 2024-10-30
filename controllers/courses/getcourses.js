const Course = require('../../models/Courses');


// Controlador para obtener todos los cursos
const getCourses = async (req, res) => {
  try {
    // Obtener todos los cursos desde la base de datos
    const courses = await Course.find();

    // Enviar la respuesta con los cursos encontrados
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error al obtener los cursos:', error);
    res.status(500).json({ message: 'Hubo un error al obtener los cursos.' });
  }
};

module.exports = { getCourses };
