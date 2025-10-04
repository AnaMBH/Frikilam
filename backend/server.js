import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";

import productosRoutes from "./src/routes/productos.js"; 
import coleccionesRoutes from "./src/routes/colecciones.js";
import userRoutes from "./src/routes/userRoutes.js";
import favoritosRoutes from "./src/routes/favoritos.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

//  rutas
app.use("/api/productos", productosRoutes);
app.use("/api/colecciones", coleccionesRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api/favoritos", favoritosRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`)
);

