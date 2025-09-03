import mongoose from "mongoose";
import dotenv from "dotenv";
import Coleccion from "./models/Coleccion.js";

dotenv.config();

const data = {
  "Anime/Ataque_a_los_titanes": { count: 10, price: 15.99 },
  "Anime/Death_note": { count: 10, price: 12.99 },
  "Anime/Demon_Slayer": { count: 10, price: 13.99 },
  "Anime/Dragon_Ball": { count: 10, price: 14.99 },
  "Anime/Jujutsu_Kaise": { count: 10, price: 16.99 },
  "Anime/Naruto": { count: 10, price: 18.99 },
  "Anime/One_Piece": { count: 10, price: 19.99 },
  "DC/Arrow": { count: 6, price: 11.99 },
  "DC/Batman": { count: 6, price: 17.99 },
  "DC/Wonder_woman": { count: 4, price: 16.49 },
  "Marvel/Ant-man_&_the-wasp": { count: 6, price: 20.99 },
  "Marvel/Avengers": { count: 7, price: 21.99 },
  "Marvel/Black_panter": { count: 4, price: 18.99 },
  "Marvel/Black_widow": { count: 6, price: 15.49 },
  "Marvel/Capitan_America": { count: 4, price: 14.49 },
  "Marvel/Deadpool": { count: 4, price: 19.49 },
  "Marvel/Doctor_strange": { count: 4, price: 22.99 },
  "Marvel/Guardianes_de_la_Galaxia": { count: 6, price: 17.99 },
  "Marvel/Iron_man": { count: 5, price: 23.99 },
  "Marvel/Spiderman": { count: 5, price: 20.49 },
  "Marvel/Thor": { count: 4, price: 18.99 }
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB Atlas");

    // Limpiar colección si ya existe
    await Coleccion.deleteMany({});
    console.log("🗑️  Colecciones antiguas eliminadas");

    // Insertar colecciones nuevas
    for (const key in data) {
      const [categoria, nombre] = key.split("/");
      const { count, price } = data[key];

      const laminas = [];
      for (let i = 1; i <= count; i++) {
        laminas.push({
          nombre: `${i}.jpg`,
          precio: price,
          imagen: `/imagenes/${categoria}/${nombre}/${i}.jpg`
        });
      }

      await Coleccion.create({ categoria, nombre, laminas });
      console.log(`📦 Colección "${nombre}" insertada`);
    }

    console.log("🎉 Todas las colecciones han sido insertadas correctamente");
    process.exit();
  } catch (error) {
    console.error("❌ Error al insertar datos:", error);
    process.exit(1);
  }
};

seedDB();
