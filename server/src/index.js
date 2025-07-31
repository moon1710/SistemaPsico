// En server/src/index.js

const express = require("express");
const cors = require("cors");
// ... otras importaciones

// Importar rutas
const authRoutes = require("./routes/auth.routes");
// ... otras rutas

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Usar rutas
app.use("/api/auth", authRoutes);
// ... uso de otras rutas

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
