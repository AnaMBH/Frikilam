import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await User.findById(decoded.id);

    if (!usuario) return res.status(401).json({ message: "Usuario no encontrado" });

    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};


