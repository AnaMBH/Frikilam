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
  let users = JSON.parse(localStorage.getItem('users')) || [];
  const ID_SEP = '__SEP__';

  /* ------------------ Funciones UI ------------------ */
  function actualizarUsuarioUI() {
    const userNameDisplay = document.getElementById('user-name-display');
    const logoutBtn = document.getElementById('logout-button');
    const editBtn = document.getElementById('edit-profile-btn');

    if (userNameDisplay) {
      userNameDisplay.textContent = currentUser?.nombre || currentUser?.email || '';
    }

    if (logoutBtn) logoutBtn.style.display = currentUser ? 'inline-block' : 'none';
    if (editBtn) editBtn.style.display = currentUser ? 'block' : 'none';
  }

  function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.textContent = String(cart.length || 0);
  }

  /* ------------------ Modal imagen ------------------ */
  function openModal(imageSrc) {
    const modal = document.createElement('div');
    modal.classList.add('image-modal');
    modal.innerHTML = `<div class="modal-content"><span class="close-button" role="button" tabindex="0">&times;</span><img src="${imageSrc}" alt="Imagen ampliada"></div>`;
    document.body.appendChild(modal);

    const btn = modal.querySelector('.close-button');
    if (btn) btn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  }

  /* ------------------ Carrito / Favoritos ------------------ */
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
      priceSpan.textContent = `€${(item.price || 0).toFixed(2)}`;

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

    const iva = subtotal * 0.21;
    const envio = subtotal >= 20 ? 0 : 3;
    const total = subtotal + iva + envio;

    subtotalElem.innerText = `Subtotal: ${subtotal.toFixed(2)} €`;
    ivaElem.innerText = `IVA (21%): ${iva.toFixed(2)} €`;
    envioElem.innerText = envio === 0 ? "Envío: Gratis" : `Gastos de envío: ${envio.toFixed(2)} €`;
    totalElem.innerText = `Total a pagar: ${total.toFixed(2)} €`;
  }

  function addToCart(item) {
    if (!item || !item.folder || !item.imageNumber) return;
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    actualizarCarrito();
    alert(`Añadido al carrito:\n${item.folder} imagen ${item.imageNumber} - €${(item.price || 0).toFixed(2)}`);
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
      favoriteBtn.addEventListener('click', () => { toggleFavorite(imageId, favoriteBtn); container.remove(); });

      actions.appendChild(addToCartBtn);
      actions.appendChild(favoriteBtn);
      container.appendChild(actions);

      modalGallery.appendChild(container);
    });
  }

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

  /* ------------------ SHA-256 ------------------ */
  async function sha256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  /* ------------------ Inicialización ------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    showImages(Object.keys(folderImageCounts));
    actualizarCarrito();
    updateCartCount();
    actualizarUsuarioUI();
    updateFavoritesModal();
  });

  /* ------------------ LOGIN / REGISTRO ------------------ */
  const loginModal = document.getElementById("user-modal");
  document.getElementById("open-login-modal")?.addEventListener("click", () => loginModal?.classList.remove("hidden"));
  document.getElementById("close-user-modal")?.addEventListener("click", () => loginModal?.classList.add("hidden"));

  document.getElementById("login-btn")?.addEventListener("click", async () => {
    const email = document.getElementById("login-email").value.trim();
    const pass = document.getElementById("login-password").value.trim();
    const hashed = await sha256(pass);
    const user = users.find(u => u.email === email && u.password === hashed);
    if (!user) return alert("❌ Usuario o contraseña incorrectos.");
    currentUser = user;
    localStorage.setItem("currentUser", JSON.stringify(user));
    alert("✔ Sesión iniciada.");
    loginModal.classList.add("hidden");
    actualizarUsuarioUI();
  });

  document.getElementById("register-btn")?.addEventListener("click", async () => {
    const email = document.getElementById("register-email").value.trim();
    const pass = document.getElementById("register-password").value.trim();
    if (users.some(u => u.email === email)) return alert("❌ Este correo ya existe.");
    const hashed = await sha256(pass);
    const newUser = { id: Date.now(), email, password: hashed, rol: "usuario" };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    alert("✔ Usuario registrado.");
  });

  function logout() {
    currentUser = null;
    localStorage.removeItem("currentUser");
    actualizarUsuarioUI();
    alert("👋 Sesión cerrada.");
  }
  document.getElementById("logout-button")?.addEventListener("click", logout);

  /* ------------------ CHECKOUT ------------------ */
  const cartCheckoutBtn = document.getElementById("checkout-button");
  cartCheckoutBtn?.addEventListener("click", (e) => {
    if (!currentUser) {
      e.preventDefault();
      loginModal?.classList.remove("hidden");
      alert("⚠ Debes iniciar sesión para continuar con la compra.");
    }
  });

  /* ------------------ PERFIL / EDITAR ------------------ */
  const editProfileModal = document.getElementById("edit-profile-modal");
  document.getElementById("edit-profile-btn")?.addEventListener("click", () => {
    if (!currentUser) return;
    document.getElementById("edit-email").value = currentUser.email || "";
    document.getElementById("edit-name").value = currentUser.nombre || "";
    editProfileModal?.classList.remove("hidden");
  });
  document.getElementById("close-edit-profile")?.addEventListener("click", () => editProfileModal?.classList.add("hidden"));

  document.getElementById("save-profile-btn")?.addEventListener("click", async () => {
    if (!currentUser) return;

    const newEmail = document.getElementById("edit-email").value.trim();
    const newName = document.getElementById("edit-name").value.trim();
    const newPass = document.getElementById("edit-password").value.trim();

    if (newEmail && newEmail !== currentUser.email && users.some(u => u.email === newEmail)) {
      return alert("❌ Este correo ya existe.");
    }

    currentUser.email = newEmail || currentUser.email;
    currentUser.nombre = newName || currentUser.nombre;

    if (newPass) {
      currentUser.password = await sha256(newPass);
    }

    users = users.map(u => u.id === currentUser.id ? currentUser : u);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    alert("✔ Perfil actualizado.");
    editProfileModal.classList.add("hidden");
    actualizarUsuarioUI();
  });

  document.getElementById("delete-account-btn")?.addEventListener("click", () => {
    if (!currentUser) return;
    if (!confirm("⚠ ¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.")) return;
    users = users.filter(u => u.id !== currentUser.id);
    localStorage.setItem("users", JSON.stringify(users));
    currentUser = null;
    localStorage.removeItem("currentUser");
    alert("❌ Cuenta eliminada.");
    editProfileModal.classList.add("hidden");
    actualizarUsuarioUI();
  });

})();
