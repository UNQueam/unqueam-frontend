<template>
      <nav class="navbar">
        <div class="navbar-logo">
          <img src="/public/Unqueam_logo_image.png" alt="Logo">
        </div>
        <div class="navbar-links">
          <ul>
            <li><router-link to="/">Inicio</router-link></li>
            <li><router-link to="/juegos">Juegos</router-link></li>
            <li><router-link to="/perfil">Perfil</router-link></li>
          </ul>
        </div>
      </nav>
  </template>
  
  <script setup>
  </script>

  <style scoped>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #333;
    color: white;
    padding: 10px 20px;
  }
  
  .navbar-logo img {
    height: 40px;
  }
  
  .navbar-links ul {
    list-style: none;
    display: flex;
    gap: 20px;
  }
  
  .navbar-links a {
    color: white;
    text-decoration: none;
    font-weight: bold;
  }
  </style>