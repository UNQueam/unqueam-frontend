<script setup>
import {computed, onMounted, ref} from 'vue';
import AuthenticationService from '@/service/AuthenticationService';
import {useRoute, useRouter} from "vue-router";
import {useAuthStore} from "@/stores/authStore";
import {useToast} from 'primevue/usetoast';

const route = useRoute();
const toast = useToast();

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const isProcessingRequest = ref(false)

const authService = new AuthenticationService();
const router = useRouter();
const authStore = useAuthStore();

async function handleLogin() {
  isProcessingRequest.value = true
  try {
    const response = await authService.login(username.value, password.value)
    authStore.saveAuthenticationInfo(response.data);
    router.push('/');
  } catch (error) {
    errorMessage.value = error.response.data.message
  } finally {
    isProcessingRequest.value = false
  }
}

onMounted(() => {
  if (route.query.logout === 'true') {
    toast.add({ severity: 'info', summary: 'Sesión', detail: 'Has cerrado sesión exitosamente.', life: 3000 });
  }
});

const isButtonDisabled = computed(() => {
  return isProcessingRequest.value || username.value.length === 0 || password.value.length === 0;
});

</script>

<template>
    <div class="flex flex-column align-items-center justify-content-center mt-8 col-11 m-auto">
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full surface-card py-7 px-5 sm:px-8" style="border-radius: 53px">
          <div class="text-center mb-6">
            <div class="text-900 text-2xl font-medium mb-3">¡Bienvenido!</div>
            <span class="text-600 font-medium">Inicia sesion para continuar</span>
          </div>

          <div>
            <div class="md:w-30rem"/>
            <form @submit.prevent="handleLogin">
            <label class="block text-900 font-medium mb-2" for="email1">Nombre de usuario</label>
            <InputText id="email1" v-model="username" class="w-full mb-5" placeholder="Tú nombre de usuario" style="padding: 1rem" type="text" />
            <label class="block text-900 font-medium mb-2" for="password1">Contraseña</label>
            <Password id="password1" v-model="password" :feedback="false" :inputStyle="{ padding: '1rem' }" :toggleMask="true" class="w-full mb-3" inputClass="w-full" placeholder="Contraseña"></Password>

              <div v-if="errorMessage" class="error-message">
                {{errorMessage}}
              </div>

            <Button :disabled="isButtonDisabled" class="w-full p-3 mt-5" label="Ingresar" type="submit"></Button>
            <ProgressBar v-if="isProcessingRequest" mode="indeterminate" style="height: 3px" />
            <div class="text-center w-100 mt-2">
              <router-link class="font-medium no-underline m-auto cursor-pointer" style="color: var(--primary-color)" to="/register">¿No tienes cuenta? Registrarse</router-link>
            </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  <Toast position="top-right" />
</template>

<style scoped>
.error-message {
  background-color: #fde0e3;
  color: #424242;
  font-weight: bold;
  padding: 10px;
  text-align: center;
  border: 3px solid #9b2a3a;
  width: 100%;
  border-radius: 4px;
  margin-top: 20px;
}
</style>
