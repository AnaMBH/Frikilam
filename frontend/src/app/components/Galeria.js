import { useEffect, useState } from 'react';

export default function Galeria() {
  const [imagenes, setImagenes] = useState([]);

  useEffect(() => {
    fetch('/imagenes.json')
      .then((res) => res.json())
      .then((data) => setImagenes(data));
  }, []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      {imagenes.map((src, index) => (
        <img
          key={index}
          src={`/${encodeURI(src)}`} // importante para espacios
          alt={`Imagen ${index}`}
          style={{ width: '200px', height: 'auto' }}
        />
      ))}
    </div>
  );
}


