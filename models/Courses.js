const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  title: {
    type: String, // Título del capítulo
    required: true,
  },
  imagechap: {
    type: String, // URL de la imagen del curso
    required: true,
  },
  description: {
    type: String, // Descripción del capítulo
    required: true,
  },
  video: {
    type: String, // URL del video del capítulo
    required: true,
  },
});

const courseSchema = new mongoose.Schema({
  courseTitle: {
    type: String, // Nombre del curso
    required: true,
  },
  courseDescription: {
    type: String, // Descripción general del curso
    required: true,
  },
  image: {
    type: String, // URL de la imagen del curso
    required: true,
  },
  chapters: {
    type: [chapterSchema], // Array de capítulos, cada uno con título, descripción y video
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Fecha y hora de creación del curso
  },
});

module.exports = mongoose.model('Course', courseSchema);
