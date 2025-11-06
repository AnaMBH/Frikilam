// Galeria.js — carga imágenes desde /IMG/imagenes.json y las pone en #galeria
document.addEventListener('DOMContentLoaded', () => {
  // contenedor o lo crea si no existe
  let contenedor = document.getElementById('galeria');
  if (!contenedor) {
    contenedor = document.createElement('div');
    contenedor.id = 'galeria';
    document.body.appendChild(contenedor);
  }

  // estilo básico (puedes quitar si lo controlas desde CSS)
  contenedor.style.display = 'flex';
  contenedor.style.flexWrap = 'wrap';
  contenedor.style.gap = '16px';
  contenedor.style.justifyContent = 'center';

  // fetch desde la ruta pública (NO uses "public/" en la URL)
  fetch('/IMG/imagenes.json')
    .then(res => {
      if (!res.ok) throw new Error('HTTP error ' + res.status);
      return res.json();
    })
    .then(data => {
      // data es un array de objetos { nombre, url }
      data.forEach((item, index) => {
        if (!item || !item.url) return; // skip entries malformadas

        const wrapper = document.createElement('div');
        wrapper.className = 'image-wrapper'; // para estilo si quieres

        const img = document.createElement('img');
        // la URL en tu JSON ya empieza por /IMG/..., úsala tal cual
        img.src = item.url;
        img.alt = item.nombre ? item.nombre : `Imagen ${index + 1}`;
        img.style.width = '200px';
        img.style.height = 'auto';
        img.loading = 'lazy'; // mejora rendimiento
        img.className = 'galeria-img';

        // opcional: abrir modal al click
        img.addEventListener('click', () => {
          const modal = document.createElement('div');
          modal.className = 'image-modal';
          modal.innerHTML = `<div class="modal-content"><span class="close-button">&times;</span><img src="${item.url}" alt="${img.alt}"></div>`;
          document.body.appendChild(modal);
          const btn = modal.querySelector('.close-button');
          if (btn) btn.addEventListener('click', () => modal.remove());
          modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
        });

        // botones/actions (favorito, añadir) — opcional
        const actions = document.createElement('div');
        actions.className = 'image-actions';
        // ejemplo simple favorito
        const favBtn = document.createElement('button');
        favBtn.textContent = '🤍';
        favBtn.className = 'favorite-btn';
        favBtn.addEventListener('click', () => {
          favBtn.textContent = favBtn.textContent === '🤍' ? '❤️' : '🤍';
        });
        actions.appendChild(favBtn);

        wrapper.appendChild(img);
        wrapper.appendChild(actions);
        contenedor.appendChild(wrapper);
      });
    })
    .catch(err => {
      console.error('Error cargando imágenes:', err);
      contenedor.textContent = 'Error cargando galería.';
    });
});

