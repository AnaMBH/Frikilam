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

/* ------------------ Variables de estado ------------------ */
let filteredImages = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
/*let users = JSON.parse(localStorage.getItem("users")) || [];*/
const API_URL = "http://localhost:5000";
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

/* ------------------ Funciones auxiliares ------------------ */
function getImagesList() {
  const images = [];

  for (const path in folderImageCounts) {
    const info = folderImageCounts[path];

    for (let i = 1; i <= info.count; i++) {
      images.push({
        nombre: `${path} ${i}`,
        categoria: path,
        ruta: `/IMG/${path}/${i}.jpg`,
        price: info.price
      });
    }
  }
  return images;
}

filteredImages = getImagesList();



function showToast(message, type = "info", duration = 3000) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, duration);
}


/* ------------------ Renderizar Galería ------------------ */
function renderGallery() {
  const gallery = document.getElementById("imageGallery");
  if (!gallery) return;

  gallery.innerHTML = "";

  filteredImages.forEach(img => {
    const div = document.createElement("div");
    div.classList.add("gallery-item");
    div.innerHTML = `
      <img src="${img.ruta}" alt="${img.nombre}">
      <div class="actions">
        <button class="fav-btn" data-name="${img.nombre}">❤️</button>
        <button class="cart-btn" data-name="${img.nombre}" data-price="${img.price}">
          🛒 ${img.price.toFixed(2)} €
        </button>
      </div>
    `;
    gallery.appendChild(div);
  });
}

/* ------------------ Filtrado ------------------ */
document.querySelectorAll(".subcategory").forEach(el => {
  el.addEventListener("click", () => {
    const path = el.dataset.path;
    filteredImages = getImagesList().filter(img => img.categoria === path);
    renderGallery();
  });
});

/* ------------------ Buscador ------------------ */
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    filteredImages = getImagesList().filter(img =>
      img.nombre.toLowerCase().includes(query)
    );
    renderGallery();
  });
}

/* ------------------ Favoritos ------------------ */

function updateFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Renderizar modal de favoritos
function renderFavoritesModal() {
  const favGallery = document.getElementById("favorites-gallery");
  if (!favGallery) return;

  favGallery.innerHTML = "";

  if (!currentUser) {
    favGallery.innerHTML = "<p>Debes iniciar sesión para ver favoritos.</p>";
    return;
  }

  if (favorites.length === 0) {
    favGallery.innerHTML = "<p>No tienes favoritos aún.</p>";
    return;
  }

  favorites.forEach(name => {
    const img = getImagesList().find(i => i.nombre === name);
    if (!img) return;

    const div = document.createElement("div");
    div.classList.add("image-container");
    div.innerHTML = `
    <img src="${img.ruta}" alt="${img.nombre}" class="gallery-image">
    <button class="remove-fav" data-name="${img.nombre}">X</button>
    `;

    favGallery.appendChild(div);
  });

  // Agregar listener para eliminar favoritos
  favGallery.querySelectorAll(".remove-fav").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      favorites = favorites.filter(f => f !== name);
      updateFavorites();
      renderFavoritesModal();
    });
  });
}

// Función para agregar a favoritos
function addToFavorites(name) {
  if (!currentUser) {
    showToast("Debes iniciar sesión para guardar favoritos", "error");
    return;
  }
  if (!favorites.includes(name)) {
    favorites.push(name);
    updateFavorites();
    showToast("Añadido a favoritos", "success");
  }
}

// Abrir modal de favoritos
document.getElementById("favorites-button")?.addEventListener("click", () => {
  renderFavoritesModal();
  document.getElementById("favorites-modal").classList.remove("hidden");
});

// Cerrar modal de favoritos
document.getElementById("close-favorites")?.addEventListener("click", () => {
  document.getElementById("favorites-modal").classList.add("hidden");
});



/* ------------------ Usuario ------------------ */

// Guardar usuarios en localStorage



async function apiGetUsers() {
  const res = await fetch(`${API_URL}/api/users`);
  if (!res.ok) throw new Error("Error obteniendo usuarios");
  return await res.json();
}

async function apiCreateUser(user) {
  const res = await fetch(`${API_URL}/api/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Error creando usuario");
  }

  return data;
}

async function apiUpdateUser(id, data) {
  const res = await fetch(`${API_URL}/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Error actualizando usuario");
  return await res.json();
}

async function apiDeleteUser(id) {
  const res = await fetch(`${API_URL}/api/users/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Error eliminando usuario");
}



// Mostrar inicial del usuario en el icono
function renderUser() {
  const disp = document.getElementById("user-name-display");
  if (!disp) return;
  disp.textContent = currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : "";
}

// Control de las secciones del modal según si hay usuario logueado
function updateUserModalView() {
  const loginS = document.getElementById("login-section");
  const registerS = document.getElementById("register-section");
  const userOpt = document.getElementById("user-options-section");
  const updateSec = document.getElementById("gestionUsuarios");

  if (currentUser) {
    loginS.style.display = "none";
    registerS.style.display = "none";
    userOpt.hidden = false;
    updateSec.hidden = true;
  } else {
    loginS.style.display = "block";
    registerS.style.display = "block";
    userOpt.hidden = true;
    updateSec.hidden = true;
  }
}

// Abrir / cerrar modal de usuario
document.getElementById("user-button")?.addEventListener("click", () => {
  document.getElementById("user-modal").classList.remove("hidden");
  updateUserModalView();
});
document.getElementById("close-user-modal")?.addEventListener("click", () => {
  document.getElementById("user-modal").classList.add("hidden");
});

// LOGIN

document.getElementById("login-btn")?.addEventListener("click", async () => {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  try {
    const res = await fetch(`${API_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw new Error("Credenciales incorrectas");

    const user = await res.json();

    currentUser = {
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      token: user.token
    };

    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    renderUser();
    updateUserModalView();
    showToast("Login exitoso", "success");
    document.getElementById("user-modal").classList.add("hidden");
  } catch (error) {
    showToast("Usuario o contraseña incorrecta", "error");
  }
});


// document.getElementById("login-btn")?.addEventListener("click", () => {
//   const email = document.getElementById("login-email").value.trim();
//   const password = document.getElementById("login-password").value.trim();
//   const user = users.find(u => u.email === email && u.password === password);

//   if (user) {
//     currentUser = { ...user };
//     localStorage.setItem("currentUser", JSON.stringify(currentUser));
//     renderUser();
//     updateUserModalView();
//     showToast("Login exitoso", "success");
//     document.getElementById("user-modal").classList.add("hidden");
//   } else {
//     showToast("Usuario o contraseña incorrecta", "error");
//   }
// });

// REGISTRO

document.getElementById("register-btn")?.addEventListener("click", async () => {
  const nombre = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value.trim();

  if (!nombre || !email || !password) {
    return showToast("Todos los campos son obligatorios", "error");
  }

  try {
    await apiCreateUser({ nombre, email, password });
    showToast("Usuario registrado en BBDD", "success");
  } catch (error) {
    console.error(error);
    showToast("Error registrando usuario (email duplicado o datos inválidos)", "error");
  }
});


/*document.getElementById("register-btn")?.addEventListener("click", () => {
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value.trim();

  if (users.some(u => u.email === email)) {
    showToast("Este usuario ya existe", "error");
    return;
  }

  users.push({ email, password });
  saveUsers();
  showToast("Usuario registrado exitosamente", "success");
});*/

// LOGOUT desde el modal
document.getElementById("logout-inside-modal")?.addEventListener("click", () => {
  currentUser = null;
  localStorage.removeItem("currentUser");
  renderUser();
  updateUserModalView();
  showToast("Sesión cerrada", "info");
  document.getElementById("user-modal").classList.add("hidden");
});

// Abrir sección de modificar usuario
document.getElementById("open-update-section")?.addEventListener("click", () => {
  document.getElementById("gestionUsuarios").hidden = false;
});

// MODIFICAR USUARIO


document.getElementById("update-user-btn")?.addEventListener("click", async () => {
  if (!currentUser) {
    showToast("Debes iniciar sesión", "error");
    return;
  }

  const newEmail = document.getElementById("update-email").value.trim();
  const newPassword = document.getElementById("update-password").value.trim();

  try {
    const updatedUser = await apiUpdateUser(currentUser._id, {
      email: newEmail || currentUser.email,
      password: newPassword || currentUser.password
    });

    currentUser = updatedUser;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    renderUser();
    showToast("Usuario actualizado en BBDD", "success");
  } catch (error) {
    console.error(error);
    showToast("Error actualizando usuario", "error");
  }
});


// document.getElementById("update-user-btn")?.addEventListener("click", () => {
//   if (!currentUser) return showToast("Debes iniciar sesión", "error");

//   const newEmail = document.getElementById("update-email").value.trim();
//   const newPassword = document.getElementById("update-password").value.trim();

//   if (newEmail && users.some(u => u.email === newEmail && u.email !== currentUser.email)) {
//     return showToast("Ese correo ya está en uso", "error");
//   }

//   users = users.map(u => u.email === currentUser.email
//     ? { email: newEmail || u.email, password: newPassword || u.password }
//     : u
//   );

//   currentUser.email = newEmail || currentUser.email;
//   currentUser.password = newPassword || currentUser.password;

//   saveUsers();
//   localStorage.setItem("currentUser", JSON.stringify(currentUser));
//   renderUser();
//   showToast("Datos actualizados correctamente", "success");
// });



// ELIMINAR USUARIO
document.getElementById("delete-user-btn")?.addEventListener("click", async () => {
  if (!currentUser) return;

  const confirmDelete = confirm("¿Seguro que quieres eliminar tu cuenta?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`${API_URL}/api/users/${currentUser._id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("Error eliminando usuario");

    currentUser = null;
    localStorage.removeItem("currentUser");
    renderUser();
    updateUserModalView();
    showToast("Cuenta eliminada correctamente", "success");
    document.getElementById("user-modal").classList.add("hidden");
  } catch (error) {
    console.error(error);
    showToast("Error eliminando usuario", "error");
  }
});


// document.getElementById("delete-user-btn")?.addEventListener("click", () => {
//   if (!currentUser) return;

//   users = users.filter(u => u.email !== currentUser.email);
//   saveUsers();
//   currentUser = null;
//   localStorage.removeItem("currentUser");
//   renderUser();
//   updateUserModalView();
//   alert("Cuenta eliminada exitosamente");
// });


// RECUPERAR CONTRASEÑA
document.getElementById("forgot-password-btn")?.addEventListener("click", () => {
  document.getElementById("forgot-modal").classList.remove("hidden");
});

function closeForgotModal() {
  document.getElementById("forgot-modal").classList.add("hidden");
  document.getElementById("forgot-email").value = "";
  document.getElementById("new-password").value = "";
}

document.getElementById("send-recovery-btn")?.addEventListener("click", () => {
  const email = document.getElementById("forgot-email").value.trim();
  const newPassword = document.getElementById("new-password").value.trim();

  if (!email) return showToast("Debes ingresar un correo", "error");
  if (!newPassword) return showToast("Debes ingresar una nueva contraseña", "error");

  const user = users.find(u => u.email === email);
  if (!user) return showToast("Usuario no encontrado", "error");

  users = users.map(u => u.email === email ? { ...u, password: newPassword } : u);
  saveUsers();
  showToast("Contraseña actualizada correctamente", "success");
  closeForgotModal();
});


/* ------------------ Init ------------------ */
renderGallery();
renderUser();
updateUserModalView();

/* ================== CARRITO ================== */

const cartIcon = document.getElementById("cart-icon");
const cartCount = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const cartItems = document.getElementById("cart-items");
const totalAPagar = document.getElementById("total-a-pagar");
const payButton = document.getElementById("pay-button");
const paymentModal = document.getElementById("payment-modal");
const paymentForm = document.getElementById("payment-form");
const cancelPaymentBtn = document.getElementById("cancel-payment");
const confirmExitModal = document.getElementById("confirm-exit-modal");
const confirmExitYes = document.getElementById("confirm-exit-yes");
const confirmExitNo = document.getElementById("confirm-exit-no");


function addToCart(name, price) {
  const existing = cart.find(item => item.nombre === name);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      nombre: name,
      price: price,
      quantity: 1
    });
  }

  saveCart();
  updateCartCount();
}

document.addEventListener("click", e => {
  if (e.target.classList.contains("cart-btn")) {
    const name = e.target.dataset.name;
    const price = parseFloat(e.target.dataset.price);

    addToCart(name, price);
  }
});


/* ---------- HELPERS ---------- */

// Guardar carrito en localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Actualizar el contador del carrito (suma de todas las cantidades)
function updateCartCount() {
    cartCount.textContent = cart.reduce((total, item) => total + (item.quantity || 0), 0);
}

/* ---------- RENDER CARRITO ---------- */

function renderCart() {
  cartItems.innerHTML = "";

  if (!cart.length) {
    totalAPagar.innerHTML = `
      <div>Subtotal: €0.00</div>
      <div>IVA (21%): €0.00</div>
      <strong>Total: €0.00</strong>
    `;
    return;
  }

  let totalConIVA = 0;

  cart.forEach(item => {
    const qty = item.quantity || 1;
    totalConIVA += item.price * qty;

    const img = getImagesList().find(i => i.nombre === item.nombre);

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <img src="${img?.ruta || ""}" alt="producto">
      <div class="cart-details">
        <div class="cart-price">€${item.price.toFixed(2)}</div>
        <div class="cart-qty">
          <button class="decrease" data-name="${item.nombre}">−</button>
          <span>${qty}</span>
          <button class="increase" data-name="${item.nombre}">+</button>
        </div>
      </div>
      <button class="remove" data-name="${item.nombre}">✖</button>
    `;

    cartItems.appendChild(div);
  });

  const iva = totalConIVA * 0.21 / 1.21;
  const subtotal = totalConIVA - iva;

  totalAPagar.innerHTML = `
    <div>Subtotal: €${subtotal.toFixed(2)}</div>
    <div>IVA (21%): €${iva.toFixed(2)}</div>
    <strong>Total: €${totalConIVA.toFixed(2)}</strong>
  `;
}


/* ---------- EVENTOS CARRITO ---------- */

// Abrir carrito
cartIcon.addEventListener("click", () => {
    renderCart();
    cartModal.classList.add("active");
    document.body.classList.add("modal-open");
});

// Cerrar carrito
cartModal.querySelector(".close-button").addEventListener("click", () => {
    cartModal.classList.remove("active");
    document.body.classList.remove("modal-open");
});

// Pasar a pago
payButton.addEventListener("click", () => {
    if (!cart.length) return;
    cartModal.classList.remove("active");
    paymentModal.classList.add("active");
});

// Modificar carrito (increase/decrease/remove)
cartItems.addEventListener("click", e => {
    const target = e.target;
    const itemName = target.dataset.name;

    if (!itemName) return;

    // Eliminar producto
    if (target.classList.contains("remove")) {
        cart = cart.filter(item => item.nombre !== itemName);
    }

    // Aumentar cantidad
    if (target.classList.contains("increase")) {
        const item = cart.find(i => i.nombre === itemName);
        if (item) item.quantity++;
    }

    // Disminuir cantidad
    if (target.classList.contains("decrease")) {
        const item = cart.find(i => i.nombre === itemName);
        if (item) {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                // Si la cantidad llega a 0, eliminar
                cart = cart.filter(i => i.nombre !== itemName);
            }
        }
    }

    saveCart();
    updateCartCount();
    renderCart();
});

/* ---------- CERRAR / CONFIRMAR PAGO ---------- */

// Cerrar pago (X o cancelar)
paymentModal.querySelector(".close-button").addEventListener("click", () => {
    confirmExitModal.classList.add("active");
});
cancelPaymentBtn.addEventListener("click", () => {
    confirmExitModal.classList.add("active");
});

// Confirmar salida del pago
confirmExitYes.addEventListener("click", () => {
    confirmExitModal.classList.remove("active");
    paymentModal.classList.remove("active");
});

// Seguir en el pago
confirmExitNo.addEventListener("click", () => {
    confirmExitModal.classList.remove("active");
});

/* ---------- PAGO ---------- */

paymentForm.addEventListener("submit", e => {
    e.preventDefault();

    // Mostrar alerta de compra exitosa
    showToast("Compra realizada con éxito", "success");

    // Cerrar modal y limpiar carrito
    paymentModal.classList.remove("active");
    cart = [];
    saveCart();
    updateCartCount();
    renderCart();
});


/* ---------- INIT ---------- */

cart = JSON.parse(localStorage.getItem("cart")) || [];
updateCartCount();

/* ---------- VALIDACIÓN SOLO NÚMEROS (CVV) ---------- */
document.getElementById("payment-form")?.addEventListener("input", e => {
  if (e.target.type === "password") {
    e.target.value = e.target.value.replace(/\D/g, "");
  }
});
