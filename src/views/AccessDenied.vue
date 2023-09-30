<script setup>
</script>

<template>
  <div class="flex flex-column align-items-center justify-content-center mt-8 m-auto">
    <div class="flex flex-column align-items-center justify-content-center mt-8">
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style="border-radius: 53px">
          <div class="grid flex flex-column align-items-center">
            <div class="flex justify-content-center align-items-center border-circle" style="width: 3.2rem; height: 3.2rem; background-color: #964849;">
              <i class="text-50 pi pi-fw pi-lock text-2xl"></i>
            </div>
            <h1 class="text-900 font-bold text-4xl lg:text-5xl mb-2">Acceso Denegado</h1>
            <span class="text-600 ">No tienes los permisos necesarios para ingresar.</span>
            <span class="text-600 mb-5">Por favor contactá un administrador.</span>
            <div class="col-12 mt-5 text-center">
              <i class="pi pi-fw pi-arrow-left text-blue-500 mr-2" style="vertical-align: center"></i>
              <router-link to="/" class="text-blue-500">Ir al Inicio</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>