const express = require('express');
const bodyParser = require('body-parser');
const bancoRoutes = require('./routes/bancorout');
const loginRoutes = require('./routes/loginrout');

// Inicializamos la aplicación Express
const app = express();
const PORT = 3000;

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.json());

// Usar las rutas
app.use('/api/bancos', bancoRoutes);
app.use('/api/auth', loginRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
