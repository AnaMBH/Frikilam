# 🎨 Frikilam – Tienda Online de Láminas Frikis

Frikilam es una tienda online fullstack donde los usuarios pueden:

- Crear una cuenta e iniciar sesión  
- Ver láminas en la página principal  
- Filtrar por categorías y usar el buscador  
- Guardar láminas en favoritos  
- Realizar compras  

Este proyecto implementa un **frontend con Next.js** y un **backend con Node.js + Express**, utilizando **MongoDB (Mongoose)** como base de datos y **JWT** para la autenticación segura de usuarios.

---

## Tecnologías usadas

| Área | Tecnologías |
|------|--------------|
| **Frontend** | Next.js, React |
| **Backend** | Node.js, Express, JWT |
| **Base de datos** | MongoDB, Mongoose |
| **Testing** | Jest, Supertest |
| **Otros** | dotenv, nodemon, cors, eslint |

---

## Requisitos previos

- Node.js **v18 o superior**
- npm o yarn
- MongoDB (local o en la nube — [MongoDB Atlas](https://www.mongodb.com/atlas))

---

## Instalación y configuración


1. Clonar el repositorio
```bash
git clone https://github.com/AnaMBH/Frikilam.git
cd Frikilam

2. Configurar el backend
cd backend
npm install
cp .env.example .env

  - Edita el archivo .env con tus variables:
    # .env (backend)
    MONGO_URI=mongodb://localhost:27017/frikilam
    PORT=5000
    JWT_SECRET=tu_clave_super_segura
    CORS_ORIGIN=http://localhost:3000

  - Inicia el servidor:
    npm run dev  # El backend estará disponible en 👉 http://localhost:5000

3. Configurar el frontend
cd ../frontend
npm install

  -  Crea un archivo .env.local:
    # .env.local (frontend)
    NEXT_PUBLIC_API_URL=http://localhost:5000

  -  Inicia el servidor del frontend:
    npm run dev # El frontend estará disponible en 👉 http://localhost:3000

------------------
 Autenticación y seguridad  
 Authorization: Bearer <tu_token_jwt>
------------------

Estructura del proyecto   
Frikilam/
├─ backend/
│  ├─ src/
│  │  ├─ config/        # Conexión a la base de datos
│  │  ├─ middleware/    # Middlewares (auth, etc.)
│  │  ├─ models/        # Modelos de Mongoose
│  │  ├─ routes/        # Rutas de la API
│  │  ├─ tests/         # Pruebas con Jest y Supertest
│  │  └─ server.js      # Entry point del backend
│  ├─ package.json
│  └─ .env.example
│
├─ frontend/
│  ├─ src/
│  │  ├─ components/    # Componentes React/Next.js
│  │  ├─ pages/         # Páginas del sitio
│  │  └─ app/           # Configuración principal
│  ├─ package.json
│  └─ .env.local.example
│
└─ README.md
----------------

Testeo
cd backend
npm test
# Se validan endpoints como /api/laminas, /api/productos, /api/users, etc.

----------------

Despliegue
git push render main
# o
git push heroku main
# Configura las variables de entorno: MONGO_URI, PORT, JWT_SECRET, CORS_ORIGIN.

-----------------

Frontend (Vercel)
vercel --prod
# Configura la variable: NEXT_PUBLIC_API_URL con la URL del backend desplegado

-----------------

Autores

Ana Martín → @AnaMBH

Proyecto desarrollado en el Bootcamp Full Stack Web Development ATR V3

----------------

Licencia

Este proyecto está bajo licencia MIT — libre para uso educativo y comercial.