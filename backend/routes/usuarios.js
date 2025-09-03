import express from "express";
import Usuario from "../models/Usuario.js";

const router = express.Router();

// GET - todos los usuarios
router.get("/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select("-password");
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// POST - crear usuario
router.post("/", async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    const usuarioGuardado = await nuevoUsuario.save();
    res.status(201).json(usuarioGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
});

// PUT - actualizar usuario por ID
router.put("/:id", async (req, res) => {
  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
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
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

export default router;
