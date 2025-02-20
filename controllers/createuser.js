const bcrypt = require('bcryptjs'); // Importa bcrypt para encriptar la contraseña
const User = require('../models/Users'); // Importa el modelo de usuario

const createUser = async (req, res) => {
    try {
        const { nombre, email, password, rol, membresia, audiencia } = req.body;
        
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El usuario ya existe." });
        }

        // Hashear la contraseña antes de guardarla
        const salt = await bcrypt.genSalt(10); // Genera un "sal" con 10 rondas de encriptación
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear usuario con la contraseña encriptada
        const newUser = new User({ 
            nombre, 
            email, 
            password: hashedPassword, // Guarda la contraseña encriptada
            rol, 
            membresia, 
            audiencia 
        });

        await newUser.save();

        res.status(201).json({ message: "Usuario creado exitosamente", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Exporta la función correctamente
module.exports = createUser;
