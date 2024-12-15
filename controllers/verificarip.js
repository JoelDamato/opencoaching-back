const ActiveIP = require('../models/ActiveIP'); // Modelo de MongoDB
const MAX_INACTIVITY = 30 * 60 * 1000; // 30 minutos de inactividad permitida
const MAX_IPS = 2; // Máximo número de IPs activas permitidas por usuario

/**
 * Verificar y gestionar las IPs activas de un usuario.
 */
const checkIPs = async (req, res) => {
    const { email } = req.body;
    const userIP = req.ip; // Captura la IP del cliente

    if (!email) {
        return res.status(400).json({ message: 'Falta el correo electrónico del usuario.' });
    }

    try {
        // Buscar o crear un registro para este usuario
        let user = await ActiveIP.findOne({ email });

        if (!user) {
            // Si no existe el usuario, lo creamos con su IP actual
            user = new ActiveIP({
                email,
                ips: [{ ip: userIP, timestamp: Date.now() }],
            });
        } else {
            const currentTime = Date.now();

            // Limpieza de IPs inactivas
            user.ips = user.ips.filter((entry) => currentTime - entry.timestamp <= MAX_INACTIVITY);

            // Verificar si la IP actual ya está registrada
            const existingIP = user.ips.find((entry) => entry.ip === userIP);

            if (existingIP) {
                // Actualizar el timestamp de la IP existente
                existingIP.timestamp = currentTime;
            } else {
                // Registrar la nueva IP
                user.ips.push({ ip: userIP, timestamp: currentTime });
            }
        }

        // Validar si hay más de 2 IPs activas
        if (user.ips.length > MAX_IPS) {
            return res.status(403).json({
                status: 'multiple_ips',
                message: 'Demasiadas IPs activas para este usuario.',
            });
        }

        // Guardar los cambios en la base de datos
        await user.save();

        res.json({ status: 'ok', message: 'Acceso permitido.' });
    } catch (error) {
        console.error('Error al gestionar las IPs:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

module.exports = { checkIPs };
