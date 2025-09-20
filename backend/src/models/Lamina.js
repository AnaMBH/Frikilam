import mongoose from "mongoose";

const laminaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  categoria: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Lamina = mongoose.model("Lamina", laminaSchema);

export default Lamina;

