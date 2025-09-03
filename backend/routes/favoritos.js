import express from "express";
import Usuario from "../models/usuario.js"; // Ajusta la ruta
import { verifyToken } from "../middleware/auth.js"; // Middleware para verificar usuario logueado

const router = express.Router();

router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.userId);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(usuario.favoritos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:userId", verifyToken, async (req, res) => {
  try {
    const { folder, imageNumber } = req.body;
    const usuario = await Usuario.findById(req.params.userId);
import express from "express";
import auth from "../middleware/auth.js";
import Usuario from "../models/Usuario.js";

const router = express.Router();

// Obtener favoritos del usuario logueado
router.get("/", auth, async (req, res) => {
  try {
    const usuario = req.usuario;
    res.json(usuario.favoritos || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Añadir un favorito
router.post("/", auth, async (req, res) => {
  try {
    const usuario = req.usuario;
    const { folder, imageNumber } = req.body;

    const exists = usuario.favoritos.some(f => f.folder === folder && f.imageNumber === imageNumber);
    if (!exists) {
      usuario.favoritos.push({ folder, imageNumber });
      await usuario.save();
    }

    res.json(usuario.favoritos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar un favorito
router.delete("/", auth, async (req, res) => {
  try {
    const usuario = req.usuario;
    const { folder, imageNumber } = req.body;

    usuario.favoritos = usuario.favoritos.filter(f => !(f.folder === folder && f.imageNumber === imageNumber));
    await usuario.save();

    res.json(usuario.favoritos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

