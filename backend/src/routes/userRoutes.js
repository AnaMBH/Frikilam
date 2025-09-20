import express from "express";
import User from "../models/User.js";

const router = express.Router();

// GET - obtener usuario por ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// POST - crear usuario
router.post("/", async (req, res) => {
  try {
    const nuevoUsuario = new User(req.body);
    const usuarioGuardado = await nuevoUsuario.save();
    res.status(201).json(usuarioGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
});

// PUT - actualizar usuario por ID
router.put("/:id", async (req, res) => {
  try {
    const usuarioActualizado = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
});

// DELETE - eliminar usuario por ID
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

export default router;

