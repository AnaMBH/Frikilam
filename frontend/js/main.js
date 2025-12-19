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
let users = JSON.parse(localStorage.getItem("users")) || [];
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

/* ------------------ Renderizar Galería ------------------ */
function renderGallery() {
    const gallery = document.getElementById("imageGallery");
    if (!gallery) return;
    gallery.innerHTML = "";
    filteredImages.forEach(img => {
        const div = document.createElement("div");
        div.classList.add("gallery-item");
        div.innerHTML = `
            <img src="${img.ruta}" alt="${img.nombre}" />
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
        filteredImages = getImagesList().filter(img => img.nombre.toLowerCase().includes(query));
        renderGallery();
    });
}

/* ------------------ Favoritos ------------------ */

// Guardar favoritos en localStorage
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

    favorites.forEach(name => {
        const img = getImagesList().find(i => i.nombre === name);
        if (img) {
            const div = document.createElement("div");
            div.classList.add("image-container"); // Usamos clase para estilos
            div.innerHTML = `
                <img src="${img.ruta}" alt="${img.nombre}" class="gallery-image">
                <button class="remove-fav" data-name="${img.nombre}">X</button>
            `;
            favGallery.appendChild(div);
        }
    });
}

// Abrir modal
document.getElementById("favorites-button")?.addEventListener("click", () => {
    if (!currentUser) return alert("Debes iniciar sesión para ver favoritos");
    const modal = document.getElementById("favorites-modal");
    modal.classList.remove("hidden");
    renderFavoritesModal();
});

// Cerrar modal con la X
document.getElementById("close-favorites")?.addEventListener("click", () => {
    const modal = document.getElementById("favorites-modal");
    modal.classList.add("hidden");
});

// Añadir/Eliminar favoritos
document.addEventListener("click", e => {
    // Añadir a favoritos
    if (e.target.classList.contains("fav-btn")) {
        if (!currentUser) return alert("Debes iniciar sesión para añadir favoritos");

        const name = e.target.dataset.name;
        if (!favorites.includes(name)) favorites.push(name);
        updateFavorites();
        alert("Añadido a favoritos");
    }

    // Quitar de favoritos
    if (e.target.classList.contains("remove-fav")) {
        const name = e.target.dataset.name;
        favorites = favorites.filter(f => f !== name);
        updateFavorites();
        renderFavoritesModal();
    }
});


/*---------- Carrito ------------------*/
document.addEventListener("DOMContentLoaded", function () {
    const cartModal = document.getElementById("cart-modal");
    const cartIcon = document.getElementById("cart-icon");  // El botón del carrito
    const cartClose = cartModal.querySelector(".close-button");  // Botón de cerrar
    const payButton = document.getElementById("pay-button");
    const cartItemCount = document.getElementById("cart-item-count");  // Contador de artículos en el carrito

    // Verificar que los elementos existen
    if (!cartModal || !cartIcon || !cartClose || !payButton || !cartItemCount) {
        console.error("Faltan elementos en el DOM");
        return;
    }

    // Mostrar el modal del carrito al hacer clic en el icono del carrito
    cartIcon.addEventListener("click", function () {
        renderCartModal();  // Renderizamos el carrito
        cartModal.classList.remove("cart-hidden");  // Muestra el modal
    });

    // Cerrar el modal del carrito al hacer clic en el botón de cerrar
    cartClose.addEventListener("click", function () {
        cartModal.classList.add("cart-hidden");  // Oculta el modal
    });

    // Función para añadir productos al carrito
    function addToCart(productName, productPrice) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Verificar si el producto ya está en el carrito
        const productIndex = cart.findIndex(item => item.nombre === productName);

        if (productIndex === -1) {
            // Si no está en el carrito, agregarlo
            cart.push({ nombre: productName, price: productPrice });
            localStorage.setItem("cart", JSON.stringify(cart));  // Guardar en localStorage
            console.log(`${productName} añadido al carrito`);
        } else {
            alert("Este producto ya está en el carrito");
        }

        updateCartItemCount(); // Actualizar el contador de artículos
        renderCartModal(); // Renderizar el modal del carrito
    }

    // Función para actualizar el contador de artículos en el icono del carrito
    function updateCartItemCount() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const itemCount = cart.length;
        cartItemCount.textContent = itemCount > 0 ? itemCount : ''; // Muestra el número de artículos
    }

    // Función de renderizado del carrito
    function renderCartModal() {
        const cartItems = document.getElementById("cart-items");
        const cartTotal = document.getElementById("cart-total");
        const iva = document.getElementById("iva");
        const envio = document.getElementById("envio");
        const totalAPagar = document.getElementById("total-a-pagar");

        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length === 0) {
            cartItems.innerHTML = "<p class='cart-items-empty'>Tu carrito está vacío.</p>";
            cartTotal.textContent = "";
            iva.textContent = "";
            envio.textContent = "";
            totalAPagar.textContent = "";
            return;
        }

        let subtotal = 0;
        cartItems.innerHTML = ''; // Limpiar contenido antes de añadir los nuevos productos

        cart.forEach(item => {
            const img = getImagesList().find(i => i.nombre === item.nombre);

            if (img) {
                const div = document.createElement("div");
                div.classList.add("cart-item");
                div.innerHTML = `
                    <img src="${img.ruta}" alt="${img.nombre}" />
                    <span>${img.nombre} - €${img.price.toFixed(2)}</span>
                    <button class="remove-cart" data-name="${img.nombre}">✖</button>
                `;
                cartItems.appendChild(div);
                subtotal += img.price;
            }
        });

        const ivaAmount = subtotal * 0.21;
        const envioAmount = subtotal > 50 ? 0 : 5;
        const total = subtotal + ivaAmount + envioAmount;

        cartTotal.textContent = `Subtotal: €${subtotal.toFixed(2)}`;
        iva.textContent = `IVA (21%): €${ivaAmount.toFixed(2)}`;
        envio.textContent = `Envío: €${envioAmount.toFixed(2)}`;
        totalAPagar.textContent = `Total a pagar: €${total.toFixed(2)}`;
    }

    // Añadir productos al carrito desde los botones en la galería
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("cart-btn")) {
            const productName = e.target.dataset.name;
            const productPrice = parseFloat(e.target.dataset.price);
            addToCart(productName, productPrice);
        }
    });

    // Eliminar productos del carrito
    document.getElementById("cart-items").addEventListener("click", function(event) {
        if (event.target.classList.contains("remove-cart")) {
            const productName = event.target.getAttribute("data-name");
            removeFromCart(productName);
        }
    });

    function removeFromCart(productName) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart = cart.filter(item => item.nombre !== productName);
        localStorage.setItem("cart", JSON.stringify(cart)); // Guardar carrito actualizado
        renderCartModal(); // Volver a renderizar el carrito después de eliminar
        updateCartItemCount(); // Actualizar el contador de artículos
        console.log(`${productName} eliminado del carrito`);
    }

    // Inicializar renderizado del carrito y contador de artículos
    renderCartModal();
    updateCartItemCount();
});





/* ------------------ Usuario ------------------ */

// Guardar usuarios
function saveUsers() {
    localStorage.setItem("users", JSON.stringify(users));
}

// Mostrar inicial del usuario
function renderUser() {
    const disp = document.getElementById("user-name-display");
    if (!disp) return;
    disp.textContent = currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : "";
}
renderUser();

/* ---- CONTROL DE LAS SECCIONES DEL MODAL ---- */

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
updateUserModalView();

/* ---- ABRIR / CERRAR MODAL ---- */
document.getElementById("user-button")?.addEventListener("click", () => {
    document.getElementById("user-modal").classList.remove("hidden");
    updateUserModalView();
});

document.getElementById("close-user-modal")?.addEventListener("click", () => {
    document.getElementById("user-modal").classList.add("hidden");
});

/* ---- LOGIN ---- */
document.getElementById("login-btn")?.addEventListener("click", () => {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = { ...user };
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        renderUser();
        updateUserModalView();
        alert("Login exitoso");
        document.getElementById("user-modal").classList.add("hidden");
    } else {
        alert("Usuario o contraseña incorrecta");
    }
});

/* ---- REGISTRO ---- */
document.getElementById("register-btn")?.addEventListener("click", () => {
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();

    if (users.some(u => u.email === email)) {
        alert("Este usuario ya existe");
        return;
    }

    users.push({ email, password });
    saveUsers();
    alert("Usuario registrado exitosamente");
});

/* ---- LOGOUT DESDE INSIDE MODAL ---- */
document.getElementById("logout-inside-modal")?.addEventListener("click", () => {
    currentUser = null;
    localStorage.removeItem("currentUser");
    renderUser();
    updateUserModalView();
    alert("Sesión cerrada");
    document.getElementById("user-modal").classList.add("hidden");
});

/* ---- MOSTRAR SECCIÓN DE MODIFICAR USUARIO ---- */
document.getElementById("open-update-section")?.addEventListener("click", () => {
    document.getElementById("gestionUsuarios").hidden = false;
});

/* ---- MODIFICAR USUARIO ---- */
document.getElementById("update-user-btn")?.addEventListener("click", () => {
    if (!currentUser) return alert("Debes iniciar sesión");

    const newEmail = document.getElementById("update-email").value.trim();
    const newPassword = document.getElementById("update-password").value.trim();

    if (newEmail && users.some(u => u.email === newEmail && u.email !== currentUser.email)) {
        return alert("Ese correo ya está en uso");
    }

    users = users.map(u =>
        u.email === currentUser.email
            ? {
                email: newEmail || u.email,
                password: newPassword || u.password
            }
            : u
    );

    currentUser.email = newEmail || currentUser.email;
    currentUser.password = newPassword || currentUser.password;

    saveUsers();
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    renderUser();
    alert("Datos actualizados correctamente");
});

/* ---- ELIMINAR USUARIO ---- */
document.getElementById("delete-user-btn")?.addEventListener("click", () => {
    if (!currentUser) return;

    if (!confirm("¿Seguro que deseas eliminar tu cuenta?")) return;

    users = users.filter(u => u.email !== currentUser.email);
    saveUsers();

    currentUser = null;
    localStorage.removeItem("currentUser");

    renderUser();
    updateUserModalView();

    alert("Cuenta eliminada exitosamente");
});

/* ---- RECUPERAR CONTRASEÑA ---- */
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

    if (!email) return alert("Debes ingresar un correo");
    if (!newPassword) return alert("Debes ingresar una nueva contraseña");

    const user = users.find(u => u.email === email);
    if (!user) return alert("Usuario no encontrado");

    users = users.map(u => u.email === email ? { ...u, password: newPassword } : u);
    saveUsers();

    alert("Contraseña actualizada correctamente");
    closeForgotModal();
});


/* ----------- Inicialización ----------- */
renderGallery();
renderUser();
