(() => {
  /* ------------------ Config / Datos ------------------ */
  const folderImageCounts = {
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
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
  let currentUserMongo = null;
  const ID_SEP = '__SEP__';

  /* ------------------ Funciones auxiliares / UI ------------------ */
  function actualizarUsuarioUI() {
    const userNameDisplay = document.getElementById('user-name-display');
    const logoutBtn = document.getElementById('logout-button');
    const editBtn = document.getElementById('edit-profile-btn');
    if (userNameDisplay) {
      if (currentUser) userNameDisplay.textContent = currentUser.nombre || currentUser.email || '';
      else if (currentUserMongo) userNameDisplay.textContent = currentUserMongo.nombre || currentUserMongo.email || '';
      else userNameDisplay.textContent = '';
    }
    if (logoutBtn) logoutBtn.style.display = (currentUser || currentUserMongo) ? 'inline-block' : 'none';
    if (editBtn) editBtn.style.display = (currentUser || currentUserMongo) ? 'block' : 'none';
  }
  function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.textContent = String(cart.length || 0);
  }

  /* ------------------ Galería (JSON) + helper para galerías HTML existentes) ------------------ */
  // Soporta ambos contenedores: #galeria (simple) y #imageGallery (catalogo con acciones)
  function initSimpleGaleriaFromJSON() {
    const contenedor = document.getElementById('galeria');
    if (!contenedor) return;
    contenedor.innerHTML = '';
    contenedor.style.display = 'flex';
    contenedor.style.flexWrap = 'wrap';
    contenedor.style.gap = '16px';

    fetch('/imagenes.json')
      .then(res => {
        if (!res.ok) throw new Error('No se pudo cargar imagenes.json: ' + res.status);
        return res.json();
      })
      .then(data => {
        data.forEach((item, index) => {
          const src = item.url || item;
          const img = document.createElement('img');
          img.src = src.startsWith('/') ? src : '/IMG/' + src;
          img.alt = item.nombre ? `Imagen ${item.nombre}` : `Imagen ${index}`;
          img.width = 200;
          img.style.height = 'auto';
          img.style.borderRadius = '8px';
          img.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
          img.loading = 'lazy';
          img.addEventListener('click', () => openModal(img.src));
          contenedor.appendChild(img);
        });
      })
      .catch(err => {
        console.error('Error cargando imágenes:', err);
        contenedor.innerHTML = '<p style="color:salmon">Error cargando la galería.</p>';
      });
  }

  /* ------------------ Modal imagen (común) ------------------ */
  function openModal(imageSrc) {
    const modal = document.createElement('div');
    modal.classList.add('image-modal');
    modal.innerHTML = `<div class="modal-content"><span class="close-button" role="button" tabindex="0">&times;</span><img src="${imageSrc}" alt="Imagen ampliada"></div>`;
    document.body.appendChild(modal);
    const btn = modal.querySelector('.close-button');
    if (btn) btn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  }

  /* ------------------ Carrito / Favoritos / Mostrar catálogo ------------------ */
  function actualizarCarrito() {
    const cartItems = document.getElementById("cart-items");
    const subtotalElem = document.getElementById("cart-total");
    const ivaElem = document.getElementById("iva");
    const envioElem = document.getElementById("envio");
    const totalElem = document.getElementById("total-a-pagar");
    if (!cartItems || !subtotalElem || !ivaElem || !envioElem || !totalElem) return;
    cartItems.innerHTML = "";
    let subtotal = 0;
    cart.forEach((item, index) => {
      const itemElem = document.createElement("div");
      itemElem.className = 'cart-item';
      const img = document.createElement("img");
      img.src = `/IMG/${item.folder}/${item.imageNumber}.jpg`;
      img.alt = `Imagen ${item.imageNumber}`;
      img.style.width = "50px";
      img.style.marginRight = "10px";
      const priceSpan = document.createElement("span");
      priceSpan.textContent = ` €${(item.price || 0).toFixed(2)}`;
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Eliminar";
      removeBtn.style.marginLeft = "10px";
      removeBtn.onclick = () => {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        actualizarCarrito();
        updateCartCount();
      };
      itemElem.appendChild(img);
      itemElem.appendChild(priceSpan);
      itemElem.appendChild(removeBtn);
      cartItems.appendChild(itemElem);
      subtotal += Number(item.price || 0);
    });
    const iva = (21 / 121) * subtotal;
    const envio = subtotal >= 20 ? 0 : 3;
    const total = subtotal + envio;
    subtotalElem.innerText = `Subtotal (IVA incluido): ${subtotal.toFixed(2)} €`;
    ivaElem.innerText = `IVA (21%) desglosado: ${iva.toFixed(2)} €`;
    envioElem.innerText = envio === 0 ? "Envío: Gratis" : `Gastos de envío: ${envio.toFixed(2)} €`;
    totalElem.innerText = `Total a pagar: ${total.toFixed(2)} €`;
  }
  function addToCart(item) {
    if (!item || !item.folder || !item.imageNumber) return;
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`Añadido al carrito:\n${item.folder} imagen ${item.imageNumber} - €${(item.price || 0).toFixed(2)}`);
  }

  function updateFavoritesModal() {
    const modalGallery = document.getElementById('favorites-gallery');
    if (!modalGallery) return;
    modalGallery.innerHTML = '';
    if (favorites.length === 0) {
      modalGallery.innerHTML = '<p>No tienes imágenes favoritas todavía.</p>';
      return;
    }
    favorites.forEach(fav => {
      const data = folderImageCounts[fav.folder];
      const price = data ? data.price : 0;
      const container = document.createElement('div');
      container.classList.add('image-container');
      const img = document.createElement('img');
      img.src = `/IMG/${fav.folder}/${fav.imageNumber}.jpg`;
      img.alt = `Favorito: ${fav.folder} ${fav.imageNumber}`;
      img.classList.add('gallery-image');
      img.addEventListener('click', () => openModal(img.src));
      container.appendChild(img);
      const priceTag = document.createElement('p');
      priceTag.textContent = `€${price.toFixed(2)}`;
      priceTag.classList.add('price-tag');
      container.appendChild(priceTag);
      const actions = document.createElement('div');
      actions.classList.add('image-actions');
      const addToCartBtn = document.createElement('button');
      addToCartBtn.textContent = '🛒 Añadir al carrito';
      addToCartBtn.classList.add('add-to-cart-btn');
      addToCartBtn.addEventListener('click', () => addToCart({ folder: fav.folder, imageNumber: fav.imageNumber, price }));
      const imageId = `${fav.folder}${ID_SEP}${fav.imageNumber}`;
      const favoriteBtn = document.createElement('button');
      favoriteBtn.textContent = '❤️';
      favoriteBtn.classList.add('favorite-btn');
      favoriteBtn.addEventListener('click', () => {
        toggleFavorite(imageId, favoriteBtn);
        container.remove();
      });
      actions.appendChild(addToCartBtn);
      actions.appendChild(favoriteBtn);
      container.appendChild(actions);
      modalGallery.appendChild(container);
    });
  }

  function parseImageId(imageId) {
    if (!imageId || typeof imageId !== 'string') return [null, NaN];
    if (imageId.indexOf(ID_SEP) !== -1) {
      const parts = imageId.split(ID_SEP);
      const folder = parts.slice(0, -1).join(ID_SEP);
      const imageNumber = parseInt(parts[parts.length - 1], 10);
      return [folder, imageNumber];
    }
    const m = imageId.match(/^(.+)-(\d+)$/);
    if (m) return [m[1], parseInt(m[2], 10)];
    return [null, NaN];
  }
  function toggleFavorite(imageId, button) {
    const [folder, imageNumber] = parseImageId(imageId);
    if (!folder || Number.isNaN(imageNumber)) return;
    const index = favorites.findIndex(f => f.folder === folder && f.imageNumber === imageNumber);
    if (index !== -1) {
      favorites.splice(index, 1);
      if (button) button.textContent = '🤍';
    } else {
      favorites.push({ folder, imageNumber });
      if (button) button.textContent = '❤️';
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesModal();
  }

  /* ------------------ Mostrar catálogo desde folderImageCounts ------------------ */
  function showImages(folders) {
    const gallery = document.getElementById('imageGallery');
    if (!gallery) return;
    gallery.innerHTML = '';
    folders.forEach(folder => {
      const data = folderImageCounts[folder];
      if (!data) return;
      for (let i = 1; i <= data.count; i++) {
        const container = document.createElement('div');
        container.classList.add('image-container');
        const img = document.createElement('img');
        img.src = `/IMG/${folder}/${i}.jpg`;
        img.alt = `${folder} imagen ${i}`;
        img.classList.add('gallery-image');
        img.addEventListener('click', () => openModal(img.src));
        container.appendChild(img);
        const priceTag = document.createElement('p');
        priceTag.textContent = `€${data.price.toFixed(2)}`;
        priceTag.classList.add('price-tag');
        container.appendChild(priceTag);
        const actions = document.createElement('div');
        actions.classList.add('image-actions');
        const addToCartBtn = document.createElement('button');
        addToCartBtn.textContent = '🛒 Añadir al carrito';
        addToCartBtn.classList.add('add-to-cart-btn');
        addToCartBtn.addEventListener('click', () => addToCart({ folder, imageNumber: i, price: data.price }));
        const imageId = `${folder}${ID_SEP}${i}`;
        const favoriteBtn = document.createElement('button');
        favoriteBtn.textContent = favorites.some(f => f.folder === folder && f.imageNumber === i) ? '❤️' : '🤍';
        favoriteBtn.classList.add('favorite-btn');
        favoriteBtn.addEventListener('click', () => toggleFavorite(imageId, favoriteBtn));
        actions.appendChild(addToCartBtn);
        actions.appendChild(favoriteBtn);
        container.appendChild(actions);
        gallery.appendChild(container);
      }
    });
  }

  /* ------------------ Payment form, auth, small admin (mantengo tus funciones) ------------------ */
  function setupPaymentForm() {
    const paymentForm = document.getElementById('payment-form');
    if (!paymentForm) return;
    paymentForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const nombre = e.target.nombre?.value?.trim();
      const email = e.target.email?.value?.trim();
      const telefono = e.target.telefono?.value?.trim();
      const direccion = e.target.direccion?.value?.trim();
      const ciudad = e.target.ciudad?.value?.trim();
      const provincia = e.target.provincia?.value?.trim();
      const cp = e.target["Codigo-postal"]?.value?.trim();
      const tarjeta = e.target.tarjeta?.value?.trim();
      const exp = e.target.exp?.value?.trim();
      const cvc = e.target.cvc?.value?.trim();
      if (!nombre || !email || !telefono || !direccion || !ciudad || !provincia || !cp || !tarjeta || !exp || !cvc) {
        alert("Por favor, rellena todos los campos del formulario.");
        return;
      }
      alert('¡Gracias por tu compra!');
      cart = [];
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      actualizarCarrito();
      paymentForm.classList.add('hidden');
      const cartModal = document.getElementById('cart-modal');
      if (cartModal) cartModal.classList.add('cart-hidden');
    });
    const expInput = document.getElementById('exp');
    const errorMsg = document.getElementById('exp-error');
    if (expInput) {
      expInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2);
        e.target.value = value.slice(0, 5);
        if (e.target.value.length === 5) {
          const [mes, anio] = e.target.value.split('/').map(n => parseInt(n, 10));
          const hoy = new Date();
          const mesActual = hoy.getMonth() + 1;
          const anioActual = hoy.getFullYear() % 100;
          const fechaValida = (mes >= 1 && mes <= 12) && (anio > anioActual || (anio === anioActual && mes >= mesActual));
          if (errorMsg) errorMsg.style.display = fechaValida ? 'none' : 'inline';
          expInput.setCustomValidity(fechaValida ? '' : 'Fecha inválida');
        } else {
          if (errorMsg) errorMsg.style.display = 'none';
          expInput.setCustomValidity('');
        }
      });
    }
  }

  // Local auth, backend auth, user management: copia tus implementaciones (las dejo fuera por brevedad en esta respuesta)
  function setupLocalAuth() { /* ... tienes tu implementación anterior ... */ }
  async function setupBackendAuth() { /* ... */ }
  function setupUserManagement() { /* ... */ }

  /* ------------------ Login/Register modal pequeño (reutilizable) ------------------ */
  let userModalContentEl = null;
  function injectLoginRegisterUI() {
    const userModal = document.getElementById('user-modal');
    if (!userModal) return;
    userModalContentEl = userModal.querySelector('.user-modal-content') || userModal;
    const loginFormHTML = `
      <h2>Iniciar Sesión</h2>
      <form id="login-form">
        <input id="login-email" type="email" placeholder="Email" required><br><br>
        <input id="login-password" type="password" placeholder="Contraseña" required><br><br>
        <button type="submit">Iniciar Sesión</button>
      </form>
      <p style="margin-top:10px; cursor:pointer; color:#0d6efd;" id="switch-to-register">¿No tienes cuenta? Registrarse</p>
    `;
    const registerFormHTML = `
      <h2>Registrarse</h2>
      <form id="register-form">
        <input id="register-name" type="text" placeholder="Usuario" required><br><br>
        <input id="register-email" type="email" placeholder="Email" required><br><br>
        <input id="register-password" type="password" placeholder="Contraseña" required><br><br>
        <button type="submit">Registrarse</button>
      </form>
      <p style="margin-top:10px; cursor:pointer; color:#0d6efd;" id="switch-to-login">¿Ya tienes cuenta? Iniciar Sesión</p>
    `;
    function showLogin() {
      if (!userModalContentEl) return;
      userModalContentEl.innerHTML = loginFormHTML;
      document.getElementById('switch-to-register')?.addEventListener('click', showRegister);
    }
    function showRegister() {
      if (!userModalContentEl) return;
      userModalContentEl.innerHTML = registerFormHTML;
      document.getElementById('switch-to-login')?.addEventListener('click', showLogin);
    }
    // Exponer estas funciones para el resto del script (si se necesita)
    window._frikilam_showLogin = showLogin;
    window._frikilam_showRegister = showRegister;
    // Mostrar login por defecto
    showLogin();
  }

  /* ------------------ Init general ------------------ */
  function init() {
    // limpiar favoritos corruptos
    favorites = (favorites || []).filter(f => f && typeof f === 'object' && f.folder && f.imageNumber);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    actualizarUsuarioUI();
    // inicializa galerías:
    initSimpleGaleriaFromJSON(); // si existe #galeria
    showImages(Object.keys(folderImageCounts)); // si existe #imageGallery
    updateCartCount();
    updateFavoritesModal();
    // inject login/register UI if modal exists
    injectLoginRegisterUI();

    // handlers globales (favoritos/carrito/user)
    const favoritesButton = document.getElementById('favorites-button');
    if (favoritesButton) favoritesButton.addEventListener('click', (e) => {
      e.stopPropagation();
      const modal = document.getElementById('favorites-modal');
      if (modal) modal.classList.toggle('hidden');
      updateFavoritesModal();
    });
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) cartIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      const modal = document.getElementById('cart-modal');
      if (modal) modal.classList.toggle('cart-hidden');
      actualizarCarrito();
    });
    const userBtn = document.getElementById('user-button');
    if (userBtn) userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const userModal = document.getElementById('user-modal');
      if (userModal) userModal.classList.toggle('hidden');
      // mostrar login (usa la función inyectada)
      window._frikilam_showLogin?.();
    });

    // setup forms & modules
    setupLocalAuth();
    setupBackendAuth();
    setupPaymentForm();
    setupUserManagement();
    actualizarCarrito();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else init();

  // export para debug o uso externo
  window.app = {
    addToCart,
    toggleFavorite,
    actualizarCarrito,
    showImages,
    updateCartCount
  };
})();
