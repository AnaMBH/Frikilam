const fs = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, 'public', 'IMG');
const OUTPUT_FILE = path.join(__dirname, 'public', 'imagenes.json');

// Función para recorrer carpetas recursivamente
function obtenerImagenes(dir, rutaWebBase = '/IMG') {
  let resultados = [];
  const archivos = fs.readdirSync(dir);

  archivos.forEach(nombre => {
    const rutaCompleta = path.join(dir, nombre);
    const rutaWeb = path.join(rutaWebBase, nombre).replace(/\\/g, '/'); // para Windows

    if (fs.statSync(rutaCompleta).isDirectory()) {
      resultados = resultados.concat(obtenerImagenes(rutaCompleta, rutaWeb));
    } else if (/\.(jpg|jpeg|png|svg|webp)$/i.test(nombre)) {
      resultados.push({
        nombre: path.parse(nombre).name,
        url: rutaWeb
      });
    }
  });

  return resultados;
}

const imagenes = obtenerImagenes(IMG_DIR);

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(imagenes, null, 2), 'utf-8');
console.log('✅ imagenes.json actualizado con', imagenes.length, 'imágenes.');

