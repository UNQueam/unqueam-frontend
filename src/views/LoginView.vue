<script setup>
import {ref} from 'vue';

const usernameOrEmail = ref('');
const password = ref('');

</script>

<template>
    <div class="flex flex-column align-items-center justify-content-center mt-8 col-11 m-auto">
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
          <div class="text-center mb-6">
            <div class="text-900 text-3xl font-medium mb-3">¡Bienvenido!</div>
            <span class="text-600 font-medium">Inicia sesion para continuar</span>
          </div>

          <div>
            <label class="block text-900 text-xl font-medium mb-2" for="email1">Usuario o correo electronico</label>
            <InputText id="email1" v-model="usernameOrEmail" class="w-full md:w-30rem mb-5" placeholder="Usuario o correo electronico" style="padding: 1rem" type="text" />

            <label class="block text-900 font-medium text-xl mb-2" for="password1">Contraseña</label>
            <Password id="password1" v-model="password" :feedback="false" :inputStyle="{ padding: '1rem' }" :toggleMask="true" class="w-full mb-3" inputClass="w-full" placeholder="Contraseña"></Password>

            <Button class="w-full p-3 mt-5 text-xl" label="Ingresar"></Button>
          </div>
        </div>
      </div>
    </div>
</template>

<style scoped>
</style>
