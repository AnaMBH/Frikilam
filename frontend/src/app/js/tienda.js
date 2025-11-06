// === Buscador ===

const searchInput = document.getElementById("searchInput");
const clearIcon = document.getElementById("clearIcon");

// Mostrar / ocultar la X
if (searchInput && clearIcon) {
  searchInput.addEventListener("input", function () {
    clearIcon.style.display = searchInput.value.trim() !== "" ? "block" : "none";
  });

  clearIcon.addEventListener("click", function () {
    searchInput.value = "";
    clearIcon.style.display = "none";
    searchInput.focus();

    // Restablecer galería completa al limpiar
    if (window.app && typeof window.app.showImages === "function") {
      window.app.showImages(Object.keys(window.app.folderImageCounts));
    }
  });
}

