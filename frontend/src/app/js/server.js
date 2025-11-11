import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import favoritosRouter from "./routes/favoritos.js";
import usuariosRouter from "./routes/usuarios.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/usuarios", usuariosRouter);

// Conectar a MongoDB
mongoose
  .connect("mongodb://localhost:27017/miBase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// Rutas
app.use("/api/favoritos", favoritosRouter);

// Solo arrancar el servidor si no estamos en test
if (process.env.NODE_ENV !== "test") {
  const PORT = 3000;
  app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
}

export { app };
