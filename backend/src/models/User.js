import mongoose from "mongoose";

// Validación para email
const emailValidator = {
  validator: function(email) {
    // Regex básica para email
    return /^\S+@\S+\.\S+$/.test(email);
  },
  message: props => `${props.value} no es un email válido`
};

// Schema del usuario
const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    trim: true,
    minlength: [2, "El nombre debe tener al menos 2 caracteres"]
  },
  email: {
    type: String,
    required: [true, "El email es obligatorio"],
    unique: true,
    lowercase: true,
    validate: emailValidator
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
    minlength: [6, "La contraseña debe tener al menos 6 caracteres"]
  },
  favoritos: [
    {
      folder: {
        type: String,
        required: [true, "El folder es obligatorio"],
        trim: true
      },
      imageNumber: {
        type: Number,
        required: [true, "El número de imagen es obligatorio"],
        min: [0, "El número de imagen no puede ser negativo"]
      }
    }
  ]
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;

