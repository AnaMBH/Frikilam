import express from "express";
import Lamina from "../models/Lamina.js";

const router = express.Router();

// GET - listar todas
router.get("/", async (req, res) => {
  try {
    const laminas = await Lamina.find();
    res.json(laminas);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// GET - obtener por ID
router.get("/:id", async (req, res) => {
  try {
    const lamina = await Lamina.findById(req.params.id);
    if (!lamina) return res.status(404).json({ mensaje: "Lámina no encontrada" });
    res.json(lamina);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// POST - crear nueva
router.post("/", async (req, res) => {
  try {
    const nuevaLamina = new Lamina(req.body);
    const laminaGuardada = await nuevaLamina.save();
    res.status(201).json(laminaGuardada);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
});

export default router;
