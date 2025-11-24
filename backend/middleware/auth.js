import Usuario from "../models/Usuario.js";

// Middleware para proteger rutas y pasar el usuario logueado
export default async function auth(req, res, next) {
  try {
    const email = req.header("x-user-email"); // se envía desde frontend
    if (!email) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    req.usuario = usuario; // guardamos el usuario en la request
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en autenticación" });
  }
}
