const Course = require('../../models/Courses');

const crearCurso = async (req, res) => {
  try {
    const { courseTitle, courseDescription, image, chapters } = req.body;

    const nuevoCurso = new Course({
      courseTitle,
      courseDescription,
      image,
      chapters,
    });

    await nuevoCurso.save();
    res.status(201).json({ message: "Curso creado exitosamente", curso: nuevoCurso });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el curso", error });
  }
};

module.exports = { crearCurso };
