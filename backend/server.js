import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productosRoutes from "./routes/productos.js"; 
import coleccionesRoutes from "./routes/colecciones.js";
import usuariosRoutes from "./routes/usuarios.js";
import favoritosRoutes from "./routes/favoritos.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

//  rutas
app.use("/api/productos", productosRoutes);
app.use("/api/colecciones", coleccionesRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/favoritos", favoritosRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
