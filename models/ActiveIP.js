const mongoose = require('mongoose');

const activeIPSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, // Identificador único del usuario
    ips: [
        {
            ip: { type: String, required: true }, // Dirección IP
            timestamp: { type: Number, required: true }, // Última actividad de la IP
        },
    ],
});

module.exports = mongoose.model('ActiveIP', activeIPSchema);
