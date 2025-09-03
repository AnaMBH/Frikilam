// Buscador 

// Obtener los elementos
const searchBox = document.getElementById("searchBox");
const clearIcon = document.getElementById("clearIcon");

// Mostrar y ocultar la X según el texto escrito
searchBox.addEventListener("input", function() {
    if (searchBox.value !== "") {
        clearIcon.style.display = "block"; // Mostrar la X
    } else {
        clearIcon.style.display = "none"; // Ocultar la X
    }
});

// Funcionalidad para borrar el texto al hacer clic en la X
clearIcon.addEventListener("click", function() {
    searchBox.value = ""; // Vaciar el campo
    clearIcon.style.display = "none"; // Ocultar la X
    searchBox.focus(); // Focalizar el campo de texto
});

// X del buscador 

const input = document.querySelector('.search_box input');
const clearIcon = document.getElementById('clearIcon');

// Cuando escribes en el input
input.addEventListener('input', function() {
    if (input.value.trim().length > 0) {
        clearIcon.style.display = 'block'; // muestra la X
    } else {
        clearIcon.style.display = 'none'; // oculta la X
    }
});

// Cuando haces clic en la X
clearIcon.addEventListener('click', function() {
    input.value = ''; // limpia el input
    clearIcon.style.display = 'none'; // oculta la X
    input.focus(); // vuelve a enfocar el input
});

