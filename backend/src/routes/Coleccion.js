import mongoose from "mongoose";

const laminaSchema = new mongoose.Schema({
  nombre: { type: String, required: true }, // "1.jpg", "2.jpg"...
  precio: { type: Number, required: true },
  imagen: { type: String } // ruta o URL a la imagen
});

const coleccionSchema = new mongoose.Schema({
  categoria: { type: String, required: true }, // "Anime"
  nombre: { type: String, required: true },    // "Ataque_a_los_titanes"
  laminas: [laminaSchema]
}, {
  timestamps: true
});

const Coleccion = mongoose.model("Coleccion", coleccionSchema);
export default Coleccion;
