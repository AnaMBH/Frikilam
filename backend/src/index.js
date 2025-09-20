import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import laminasRoutes from "./routes/laminas.js";
import productosRoutes from "./routes/productos.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// connect to DB
connectDB().catch(err => {
  console.error("Error connecting to DB:", err.message);
  process.exit(1);
});

// API routes
app.use("/api/laminas", laminasRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/users", userRoutes);

// health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

