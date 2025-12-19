import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";


//  REGISTRAR USUARIO

export const registerUser = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    // Verificar si ya existe
    const existeUsuario = await User.findOne({ email });
    if (existeUsuario) {
      return res.status(400).json({ msg: "El email ya está registrado." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const nuevoUsuario = new User({
      nombre,
      email,
      password: hashedPass
    });

    await nuevoUsuario.save();

    res.json({ msg: "Usuario registrado correctamente" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};


//  LOGIN DE USUARIO

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await User.findOne({ email });
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecta)
      return res.status(400).json({ msg: "Contraseña incorrecta" });

    // Crear token
    const token = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};


//  SOLICITAR RECUPERACIÓN DE CONTRASEÑA

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const usuario = await User.findOne({ email });
    if (!usuario)
      return res.status(404).json({ msg: "No existe un usuario con ese correo." });

    // Crear token seguro
    const token = crypto.randomBytes(32).toString("hex");

    usuario.resetToken = token;
    usuario.resetTokenExpire = Date.now() + 15 * 60 * 1000; // Expira en 15 minutos

    await usuario.save();

    // Configurar transporte
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const resetUrl = `http://localhost:5173/reset-password.html?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: usuario.email,
      subject: "Recuperación de contraseña",
      html: `
        <h2>Recupera tu contraseña</h2>
        <p>Haz clic aquí para restablecer tu contraseña:</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
        <p>Este enlace caduca en 15 minutos</p>
      `
    });

    res.json({ msg: "Correo de recuperación enviado." });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// ===============================
//  RESETEAR CONTRASEÑA
// ===============================
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const usuario = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() }
    });

    if (!usuario)
      return res.status(400).json({ msg: "Token inválido o caducado" });

    // Hash de nueva contraseña
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);

    usuario.resetToken = null;
    usuario.resetTokenExpire = null;

    await usuario.save();

    res.json({ msg: "Contraseña actualizada correctamente" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
