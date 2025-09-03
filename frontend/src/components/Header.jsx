import React, { useState } from "react";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");

  // Datos de ejemplo para categorías y subcategorías
  const categories = {
    Anime: ["One Piece", "Naruto", "Dragon Ball"],
    Marvel: ["Thor", "Iron Man", "Spider-Man"],
    DC: ["Batman", "Superman", "Wonder Woman"],
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Aquí podrías añadir lógica para filtrar mientras se escribe
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSubcategory(""); // Reset subcategory al cambiar categoría
  };

  const handleSubcategoryChange = (e) => {
    setSubcategory(e.target.value);
  };

  return (
    <header className="bg-gray-900 text-white p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Logo */}
      <div className="text-3xl font-bold cursor-pointer select-none">
        Frikilam
      </div>

      {/* Buscador */}
      <input
        type="search"
        placeholder="Buscar láminas..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="flex-grow md:flex-grow-0 md:w-64 px-3 py-2 rounded text-gray-900"
      />

      {/* Filtros */}
      <div className="flex gap-2">
        <select
          value={category}
          onChange={handleCategoryChange}
          className="rounded px-2 py-1 text-gray-900"
        >
          <option value="">Todas las categorías</option>
          {Object.keys(categories).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={subcategory}
          onChange={handleSubcategoryChange}
          className="rounded px-2 py-1 text-gray-900"
          disabled={!category}
        >
          <option value="">Subcategoría</option>
          {category &&
            categories[category].map((subcat) => (
              <option key={subcat} value={subcat}>
                {subcat}
              </option>
            ))}
        </select>
      </div>

      {/* Iconos derecha */}
      <div className="flex gap-4 items-center">
        {/* Corazón Favoritos */}
        <button
          aria-label="Favoritos"
          className="hover:text-red-500 transition"
          title="Favoritos"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
            />
          </svg>
        </button>

        {/* Carrito */}
        <button
          aria-label="Carrito de compra"
          className="hover:text-green-400 transition"
          title="Carrito"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l-2 6h12M17 13l1.5 6M6 19a1 1 0 102 0 1 1 0 00-2 0zm10 0a1 1 0 102 0 1 1 0 00-2 0z"
            />
          </svg>
        </button>

        {/* Login */}
        <button
          aria-label="Inicio de sesión"
          className="hover:text-blue-400 transition"
          title="Iniciar sesión"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12H3m6 6v-6m0 0V6m0 6l6-6"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
