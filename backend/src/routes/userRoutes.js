import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword
} from "../controllers/userController.js";

import User from "../models/User.js";

const router = express.Router();


// =====================
// AUTH & EXTRA FEATURES
// =====================
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


// =====================
// CRUD USUARIOS (BBDD)
// =====================


// CREATE
router.post("/", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = await User.create({
      nombre,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// READ (todos)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ (por id)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: "ID inválido" });
  }
});


// UPDATE usuario
router.put("/:id", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const updateData = {};
    if (email) updateData.email = email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
        select: "-password"
      }
    );

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
});




// DELETE usuario
router.delete("/:id", async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (err) {
    next(err);
  }
});



export default router;



