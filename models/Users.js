const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cursos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  membresia: {
    type: Number,
    enum: [0,1,2,3,4],
    default: 0,
  }, 
    imagenPerfil: {
    type: String,
    default: ".jpg"
  },
  rol: {
    type: String,
    enum: ["user", "admin"], // Define los roles permitidos
    default: "user", // Valor predeterminado
  },
  audiencia: {
    type: String,
    enum: ["Cliente", "Coach Certificado", "Coach Aprendiz"], // Define los roles permitidos
    default: "Cliente", // Valor predeterminado
  },
});

module.exports = mongoose.model('User', UserSchema);
