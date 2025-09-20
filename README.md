HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
# Frikilam – Tienda Online de Láminas Frikis

Proyecto fullstack de una tienda online donde los usuarios pueden:

- Crear una cuenta e iniciar sesión  
- Ver láminas en la página principal  
- Filtrar por categorías y usar el buscador  
- Guardar láminas en favoritos  
- Realizar compras  

Este proyecto implementa un **frontend con Next.js** y un **backend con Node.js y Express**, utilizando **MongoDB** para la persistencia de datos y un **modelo API REST** para la comunicación entre ambas partes.

---

## Tecnologías usadas

- **Frontend:** Next.js / React  
- **Backend:** Node.js / Express  
- **Base de datos:** MongoDB / Mongoose  
- **Otros:** dotenv, nodemon, cors, eslint, jest, supertest  

---

## Requisitos previos

- Node.js (18.x o superior recomendado)  
- npm o yarn  
- MongoDB (local o en la nube, por ejemplo [MongoDB Atlas](https://www.mongodb.com/atlas))  

---

## Instalación y configuración

### Clonar el repositorio

```bash
git clone https://github.com/AnaMBH/Frikilam.git
cd Frikilam

Backend
cd backend
npm install
cp .env.example .env
# Edita .env con tus variables de entorno:
# MONGO_URI=<tu_URI_de_MongoDB>
# PORT=5000
npm run dev

El backend correrá por defecto en http://localhost:5000

Endpoints disponibles:

GET /api/laminas → Listar todas las láminas

GET /api/laminas/:id → Obtener lámina por ID

POST /api/laminas → Crear nueva lámina

GET /api/productos → Listar productos

GET /api/users → Listar usuarios

Frontend
cd ../frontend
npm install
npm run dev


El frontend correrá por defecto en http://localhost:3000

Se conecta al backend mediante los endpoints definidos.

Estructura del proyecto
Frikilam/
├─ backend/
│  ├─ src/
│  │  ├─ config/       # Configuración de la DB
│  │  ├─ models/       # Modelos de MongoDB
│  │  ├─ routes/       # Rutas de la API
│  │  └─ index.js      # Entry point del backend
├─ frontend/
│  ├─ src/
│  │  ├─ components/   # Componentes React
│  │  ├─ pages/        # Páginas de Next.js
│  │  └─ app/          # App principal de Next.js
├─ .env.example
├─ package.json
└─ README.md

Testeo
cd backend
npm test


El backend incluye pruebas con Jest y Supertest para verificar que los endpoints /laminas, /productos y /users funcionan correctamente.

Deployment
Backend
# Con Heroku o Render
git push heroku main
# Configura variables de entorno: MONGO_URI, PORT

Frontend
# Con Vercel
vercel --prod
# Configura la URL del backend en NEXT_PUBLIC_API_URL
