// rutas públicas y parsing seguro
(() => {
  // ----- carpetas, cantidad y precio -----
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

  // ----- Estado persistente -----
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null; // local
  let currentUserMongo = null; // backend

  // separador único para imageId (evita conflictos con guiones en nombres)
  const ID_SEP = '__SEP__';

  // ----- Helpers / UI updates -----
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
    const cartCount = document.getElementById('cart-count') || document.getElementById('cart-count'); // soporte id
    if (cartCount) cartCount.textContent = String(cart.length);
  }

  // ----- Carrito -----
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

  // ----- Favoritos -----
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
      addToCartBtn.addEventListener('click', () => {
        addToCart({ folder: fav.folder, imageNumber: fav.imageNumber, price });
      });

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

  // parsea imageId (soporta nuevo separador y fallback legacy)
  function parseImageId(imageId) {
    if (!imageId || typeof imageId !== 'string') return [null, NaN];

    // si contiene el separador único
    if (imageId.indexOf(ID_SEP) !== -1) {
      const parts = imageId.split(ID_SEP);
      const folder = parts.slice(0, -1).join(ID_SEP);
      const imageNumber = parseInt(parts[parts.length - 1], 10);
      return [folder, imageNumber];
    }

    // fallback: intenta match "carpeta-<numero>" (legacy)
    const m = imageId.match(/^(.+)-(\d+)$/);
    if (m) {
      return [m[1], parseInt(m[2], 10)];
    }

    // no se pudo parsear
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

  // ----- Modal de imagen -----
  function openModal(imageSrc) {
    const modal = document.createElement('div');
    modal.classList.add('image-modal');
    modal.innerHTML = `<div class="modal-content"><span class="close-button">&times;</span><img src="${imageSrc}" alt="Imagen ampliada"></div>`;
    document.body.appendChild(modal);
    const btn = modal.querySelector('.close-button');
    if (btn) btn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  }

  // ----- Mostrar imágenes en galería (usa folderImageCounts) -----
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
        addToCartBtn.addEventListener('click', () => {
          addToCart({ folder, imageNumber: i, price: data.price });
        });

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

  // ----- Formulario de pago (validación y envío simulado) -----
  function setupPaymentForm() {
    const paymentForm = document.getElementById('payment-form');
    if (!paymentForm) return;

    paymentForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const nombre = e.target.nombre.value.trim();
      const email = e.target.email.value.trim();
      const telefono = e.target.telefono.value.trim();
      const direccion = e.target.direccion.value.trim();
      const ciudad = e.target.ciudad.value.trim();
      const provincia = e.target.provincia.value.trim();
      const cp = e.target["Codigo-postal"].value.trim();
      const tarjeta = e.target.tarjeta.value.trim();
      const exp = e.target.exp.value.trim();
      const cvc = e.target.cvc.value.trim();

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

    // Exp input formatting/validation
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
          expInput.setCustomValidity(fechaValida ? '' : 'Fecha de expiración inválida o pasada');
        } else {
          if (errorMsg) errorMsg.style.display = 'none';
          expInput.setCustomValidity('');
        }
      });
    }
  }

  // ----- Login / Registro / Perfil (backend) -----
  async function setupBackendAuth() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        try {
          const res = await fetch('http://localhost:3000/api/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const data = await res.json();
          if (res.ok) {
            currentUserMongo = data.usuario;
            actualizarUsuarioUI();
            alert(`Bienvenido ${currentUserMongo.nombre || currentUserMongo.email}`);
            const userModal = document.getElementById('user-modal');
            if (userModal) userModal.classList.add('hidden');
          } else {
            alert(data.message || 'Error al iniciar sesión');
          }
        } catch (err) {
          console.error(err);
          alert('Error de conexión con el servidor');
        }
      });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        try {
          const res = await fetch('http://localhost:3000/api/usuarios/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, password })
          });
          const data = await res.json();
          if (res.ok) {
            currentUserMongo = data.usuario;
            actualizarUsuarioUI();
            alert(`Cuenta creada para ${nombre}`);
            const userModal = document.getElementById('user-modal');
            if (userModal) userModal.classList.add('hidden');
          } else {
            alert(data.message || 'Error al registrarse');
          }
        } catch (err) {
          console.error(err);
          alert('Error de conexión con el servidor');
        }
      });
    }

    const editForm = document.getElementById('edit-profile-form');
    if (editForm) {
      editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentUserMongo) return alert('No hay usuario logueado en backend');
        const email = document.getElementById('edit-email').value;
        const password = document.getElementById('edit-password').value;
        try {
          const res = await fetch('http://localhost:3000/api/usuarios/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: currentUserMongo._id, email, password })
          });
          const data = await res.json();
          if (res.ok) {
            currentUserMongo = data.usuario;
            actualizarUsuarioUI();
            alert('Perfil actualizado');
          } else {
            alert(data.message || 'Error al actualizar');
          }
        } catch (err) {
          console.error(err);
          alert('Error de conexión con el servidor');
        }
      });
    }

    const delBtn = document.getElementById('delete-account-btn');
    if (delBtn) {
      delBtn.addEventListener('click', async () => {
        if (!currentUserMongo) return;
        if (!confirm('¿Seguro que deseas eliminar tu cuenta?')) return;
        try {
          const res = await fetch(`http://localhost:3000/api/usuarios/delete/${currentUserMongo._id}`, { method: 'DELETE' });
          const data = await res.json();
          if (res.ok) {
            currentUserMongo = null;
            actualizarUsuarioUI();
            alert('Cuenta eliminada');
          } else {
            alert(data.message || 'Error al eliminar cuenta');
          }
        } catch (err) {
          console.error(err);
          alert('Error de conexión con el servidor');
        }
      });
    }
  }

  // ----- Local auth (registro + login almacenado localmente) -----
  function setupLocalAuth() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuario = usuarios.find(u => u.email === email && u.password === password);
        if (usuario) {
          currentUser = usuario;
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          actualizarUsuarioUI();
          alert(`Bienvenido ${usuario.nombre}`);
          const userModal = document.getElementById('user-modal');
          if (userModal) userModal.classList.add('hidden');
        } else {
          alert('Usuario o contraseña incorrectos');
        }
      });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        if (usuarios.find(u => u.email === email)) {
          alert('Este correo ya está registrado');
          return;
        }
        const nuevoUsuario = { nombre, email, password };
        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        currentUser = nuevoUsuario;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        actualizarUsuarioUI();
        alert(`Cuenta creada para ${nombre}`);
        const userModal = document.getElementById('user-modal');
        if (userModal) userModal.classList.add('hidden');
      });
    }

    const logoutBtn = document.getElementById('logout-button');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        currentUser = null;
        localStorage.removeItem('currentUser');
        actualizarUsuarioUI();
        alert('Sesión cerrada');
      });
    }
  }

  // ----- Gestión CRUD de usuarios (UI pequeña) -----
  function setupUserManagement() {
    const formCrear = document.getElementById('formCrearUsuario');
    const listaUsuarios = document.getElementById('listaUsuarios');
    if (!formCrear || !listaUsuarios) return;

    function renderUsuarios() {
      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      listaUsuarios.innerHTML = '';
      usuarios.forEach((u) => {
        const li = document.createElement('li');
        li.textContent = `${u.nombre} - ${u.email} `;
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Eliminar';
        delBtn.addEventListener('click', () => {
          const nuevos = usuarios.filter(x => x.email !== u.email);
          localStorage.setItem('usuarios', JSON.stringify(nuevos));
          renderUsuarios();
        });
        li.appendChild(delBtn);
        listaUsuarios.appendChild(li);
      });
    }

    formCrear.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('usuario-nombre').value;
      const email = document.getElementById('usuario-email').value;
      const password = document.getElementById('usuario-password').value;
      const rol = document.getElementById('usuario-rol').value;
      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      usuarios.push({ nombre, email, password, rol });
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      renderUsuarios();
      formCrear.reset();
    });

    renderUsuarios();
  }

  // ----- Inicialización principal -----
  function init() {
    favorites = favorites.filter(f => typeof f === 'object' && f.folder && f.imageNumber);
    localStorage.setItem('favorites', JSON.stringify(favorites));

    actualizarUsuarioUI();
    showImages(Object.keys(folderImageCounts));
    updateCartCount();
    updateFavoritesModal();

    // Favoritos modal open/close
    const favBtn = document.getElementById('favorites-button');
    if (favBtn) favBtn.addEventListener('click', () => {
      updateFavoritesModal();
      const modal = document.getElementById('favorites-modal');
      if (modal) modal.classList.remove('hidden');
    });
    const closeFav = document.querySelector('.close-favorites');
    if (closeFav) closeFav.addEventListener('click', () => {
      const modal = document.getElementById('favorites-modal');
      if (modal) modal.classList.add('hidden');
    });

    // Subcategorías
    document.querySelectorAll('.subcategory')?.forEach(button => {
      button.addEventListener('click', e => {
        e.preventDefault();
        showImages([button.dataset.path]);
      });
    });

    // Búsqueda en tiempo real
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        const filtered = Object.keys(folderImageCounts).filter(folder => folder.toLowerCase().includes(query));
        showImages(filtered);
      });

      // Clear icon (si existe)
      const clearIcon = document.getElementById('clearIcon') || document.querySelector('.clear');
      if (clearIcon) {
        searchInput.addEventListener('input', () => {
          clearIcon.style.display = searchInput.value.trim() ? 'block' : 'none';
        });
        clearIcon.addEventListener('click', () => {
          searchInput.value = '';
          clearIcon.style.display = 'none';
          searchInput.focus();
          showImages(Object.keys(folderImageCounts));
        });
      }
    }

    // Carrito open/close
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
      cartIcon.addEventListener('click', () => {
        const cartModal = document.getElementById('cart-modal');
        if (cartModal) cartModal.classList.remove('cart-hidden');
        actualizarCarrito();
      });
    }
    const closeCart = document.querySelector('.close-cart');
    if (closeCart) closeCart.addEventListener('click', () => {
      const cartModal = document.getElementById('cart-modal');
      if (cartModal) cartModal.classList.add('cart-hidden');
    });

    // Pagar -> mostrar formulario
    const pagarBtn = document.getElementById('pagar-btn');
    if (pagarBtn) pagarBtn.addEventListener('click', () => {
      const pf = document.getElementById('payment-form');
      if (pf) pf.classList.remove('hidden');
    });
    const closePayment = document.querySelector('.close-payment-form');
    if (closePayment) closePayment.addEventListener('click', () => {
      const pf = document.getElementById('payment-form');
      if (pf) pf.classList.add('hidden');
      const cartModal = document.getElementById('cart-modal');
      if (cartModal) cartModal.classList.add('cart-hidden');
    });

    // User button and modal
    const userBtn = document.getElementById('user-button');
    const userModal = document.getElementById('user-modal');
    const logoutBtn = document.getElementById('logout-button');
    let userMenuVisible = false;
    if (userBtn) {
      if (logoutBtn) logoutBtn.style.display = 'none';
      userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenuVisible = !userMenuVisible;
        if (userModal) userModal.classList.toggle('hidden', !userMenuVisible);
        if (logoutBtn) logoutBtn.style.display = userMenuVisible ? 'inline-block' : 'none';
      });
    }

    document.addEventListener('click', (e) => {
      if (userMenuVisible && userModal && !userModal.contains(e.target) && e.target !== userBtn) {
        userModal.classList.add('hidden');
        if (logoutBtn) logoutBtn.style.display = 'none';
        userMenuVisible = false;
      }
    });

    const closeUser = document.querySelector('.close-user-modal');
    if (closeUser) closeUser.addEventListener('click', () => {
      if (userModal) userModal.classList.add('hidden');
      if (logoutBtn) logoutBtn.style.display = 'none';
    });

    // registro/login local & backend
    setupLocalAuth();
    setupBackendAuth();
    setupPaymentForm();
    setupUserManagement();
    actualizarCarrito();
  }

  // Ejecutar init al cargar DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  // Exportar funciones globales para que otros scripts (Galeria.js) puedan usarlas
  window.app = {
    addToCart,
    toggleFavorite,
    actualizarCarrito,
    showImages,
    updateCartCount
  };
})();
