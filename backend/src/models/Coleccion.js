import mongoose from "mongoose";

const coleccionSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  laminas: [
    {
      folder: String,
      imageNumber: Number,
      price: Number
    }
  ]
}, {
  timestamps: true
});

const Coleccion = mongoose.model("Coleccion", coleccionSchema);

export default Coleccion;
