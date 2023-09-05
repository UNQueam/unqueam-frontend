<template>
  <nav class="navbar">
    <div class="navbar-logo">
      <router-link to="/">
        <img src="/public/Unqueam_logo_image.png" alt="Logo" />
      </router-link>
      <span class="hidden md:visible md:inline logo-name">
        <router-link to="/"> &lt;<span class="red-text">UN</span>Queam/&gt; </router-link>
      </span>
    </div>
    <div class="navbar-links">
      <ul>
        <li><router-link to="/">Inicio</router-link></li>
        <li><router-link to="/game/game-change-name">Juegos</router-link></li>
        <li><router-link to="/perfil">Perfil</router-link></li>
      </ul>
    </div>
  </nav>
</template>

<script setup></script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0b0b0b;
  color: white;
  padding: 10px 20px;
}
.navbar-logo {
  display: flex;
  align-items: center; /* Center vertically */
}

.navbar-logo img {
  height: 40px;
  margin-right: 10px; /* Add margin between image and text */
}

a.router-link-active {
  color: white;
}

.logo-name {
  font-family: 'Orbitron', sans-serif;
  font-size: 20px;
  display: flex;
  align-items: center;
  text-decoration: none;
}

.red-text {
  color: red;
  margin: 0;
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
