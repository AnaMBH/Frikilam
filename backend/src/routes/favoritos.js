import express from "express";
import { verifyToken } from "../middleware/auth.js"; // Ajusta la ruta según tu proyecto

const router = express.Router();

// Obtener favoritos del usuario logueado
router.get("/", verifyToken, async (req, res) => {
  try {
    const usuario = req.usuario;
    res.json(usuario.favoritos || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Añadir un favorito
router.post("/", verifyToken, async (req, res) => {
  try {
    const usuario = req.usuario;
    const { folder, imageNumber } = req.body;

    const exists = usuario.favoritos.some(
      f => f.folder === folder && f.imageNumber === imageNumber
    );

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
router.delete("/", verifyToken, async (req, res) => {
  try {
    const usuario = req.usuario;
    const { folder, imageNumber } = req.body;

    usuario.favoritos = usuario.favoritos.filter(
      f => !(f.folder === folder && f.imageNumber === imageNumber)
    );
    await usuario.save();

    res.json(usuario.favoritos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


