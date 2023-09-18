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
        <li><button aria-controls="overlay_menu" aria-haspopup="true" class="p-link" @click="toggle">{{authStore.getUsername}}</button>
          <Menu id="overlay_menu" ref="menu" :model="items"  :popup="true">
            <template #start>
              <div class="w-full flex align-items-center p-2 pl-3 text-color border-noround">
                <Avatar :label="authStore.getUsername[0]" class="mr-2" shape="circle" style="background-color:#9c27b0; color: #ffffff" />
                <div class="flex flex-column align">
                  <span class="font-bold">{{authStore.getUsername}}</span>
                  <span class="text-sm">Rol: {{authStore.getUserRole}}</span>
                </div>
              </div>
            </template>

            <template #end>
              <button class="w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround">
                <i class="pi pi-sign-out" />
                <span class="ml-2">Cerrar sesión</span>
              </button>
            </template>
          </Menu>
          <Toast />
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>

import {useAuthStore} from "@/stores/authStore";
import {ref} from "vue";
import {useToast} from "primevue/usetoast";

const authStore = useAuthStore()

const toast = useToast();
const menu = ref();
const items = ref([
  { separator: true },
  {
    label: 'Mí perfil',
    icon: 'pi pi-fw pi-user'
  },
  {
    label: 'Preferencias',
    icon: 'pi pi-fw pi-cog',
    badge: 2
  },
  { separator: true }
]);

const toggle = (event) => {
  menu.value.toggle(event);
};

const save = () => {
  toast.add({severity: 'success', summary: 'Success', detail: 'Data Saved', life: 3000});
};


</script>

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

a {
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
