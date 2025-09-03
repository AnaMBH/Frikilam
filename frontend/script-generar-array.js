const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'IMG'); // o 'public/IMG' si usas React/Vite
let images = [];

function getImagesRecursively(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getImagesRecursively(fullPath);
    } else if (file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')) {
      const relativePath = path.relative(__dirname, fullPath).replace(/\\/g, '/');
      images.push(relativePath);
    }
  }
}

getImagesRecursively(baseDir);

// Guardar en imagenes.json
const outputPath = path.join(__dirname, 'imagenes.json');
fs.writeFileSync(outputPath, JSON.stringify(images, null, 2), 'utf-8');
console.log(`✅ Archivo imagenes.json creado con ${images.length} imágenes.`);

