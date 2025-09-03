import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseDir = path.join(__dirname, 'public', 'IMG');

function getImages(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  list.forEach((item) => {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(getImages(fullPath));
    } else if (/\.(jpe?g|png|gif|svg)$/i.test(item.name)) {
      results.push(path.relative(path.join(__dirname, 'public'), fullPath).replace(/\\/g, '/'));
    }
  });
  return results;
}

const imageList = getImages(baseDir);

fs.writeFileSync(path.join(__dirname, 'imageList.json'), JSON.stringify(imageList, null, 2));

console.log('imageList.json creado con éxito');

