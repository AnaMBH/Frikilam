import express from "express";
import Coleccion from "../models/Coleccion.js";

const router = express.Router();

// GET - todas las colecciones con sus láminas
router.get("/", async (req, res) => {
  try {
    const colecciones = await Coleccion.find();
    res.json(colecciones);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// GET - una colección específica por nombre
router.get("/:nombre", async (req, res) => {
  try {
    const coleccion = await Coleccion.findOne({ nombre: req.params.nombre });
    if (!coleccion) return res.status(404).json({ mensaje: "Colección no encontrada" });
    res.json(coleccion);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

export default router;
