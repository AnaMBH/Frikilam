// Buscador 

// Obtener los elementos
const input = document.getElementById("searchBox");
const clearIcon = document.getElementById("clearIcon");

// Mostrar u ocultar la X según el texto del input
input.addEventListener("input", () => {
    clearIcon.style.display = input.value.trim() ? "block" : "none";
});

// Borrar texto y ocultar la X al hacer clic en ella
clearIcon.addEventListener("click", () => {
    input.value = "";
    clearIcon.style.display = "none";
    input.focus();
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


