<script setup>
import {ref} from 'vue';

import {useVuelidate} from '@vuelidate/core';
import {email, helpers, required} from '@vuelidate/validators';
import {getCustomError} from '@/utils/FormErrorMessageHandler';
import AuthenticationService from "@/service/AuthenticationService";
import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores/authStore";


const passwordRegexVal = (value) => {
  return /^(?=.*[A-Z]).{8,}$/.test(value);
}

//Vuelidate:

const user = ref({
  email: '',
  username: '',
  password: '',
  confirmedPassword: '',
});

const rules = {
  email: {required, email},
  username: {required},
  password: {
    required,
    passwordRegexVal: helpers.withMessage("La contraseña debe tener al menos 8 caracteres y 1 Mayuscula", passwordRegexVal)
  },
  confirmedPassword: {
    required,
    sameAsPassword: (value) => value === user.value.password,
  },
};

const $externalResults = ref({})

const submitted = ref(false);

const v$ = useVuelidate(rules, user, {$externalResults});

const isProcessingRequest = ref(false)

const authService = new AuthenticationService();
const router = useRouter();
const authStore = useAuthStore();

async function submitForm() {
  isProcessingRequest.value = true
  $externalResults.value = {}
  submitted.value = true;

  v$.value.$validate();

  if (!v$.value.$error) {
    try {
      const response = await authService.register(user.value)
      authStore.saveAuthenticationInfo(response.data);
      router.push('/');
    } catch (error) {
      console.log(error.response.data)
      $externalResults.value = error.response.data.errors
    } finally {
      isProcessingRequest.value = false
    }
  }
  isProcessingRequest.value = false
}
</script>

<template>
  <div class="flex flex-column align-items-center justify-content-center mt-8 col-11 m-auto">
    <div
        style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
      <div class="w-full surface-card py-7 sm:px-8 px-5 " style="border-radius: 53px; min-width: 300px;">
        <div class="text-center mb-6">
          <div class="text-900 text-2xl font-medium mb-3">Registro</div>
          <span class="text-600 font-medium">Crea tu cuenta para continuar</span>
        </div>
        <div>
          <form @submit.prevent="submitForm">
            <label class="block text-900 font-medium mb-2" for="email1">Email <span class="required">*</span></label>
            <InputText
                id="email1"
                v-model.trim="user.email"
                :class="{ 'p-invalid': submitted && v$.email.$error }"
                autofocus
                class="w-full" placeholder="Ingresa tu correo electronico"
                style="padding: 1rem"
                type="text"
            />

            <div class="error-container">
              <small v-for="error of v$.email.$errors" :key="error.$uid" class="p-error">{{ getCustomError("email", error.$validator, error) + ". " }}</small>
            </div>

            <div class="md:w-30rem"/>

            <label class="block text-900 font-medium mb-2 mt-1" for="username">Usuario <span
                class="required">*</span></label>
            <InputText
                id="username"
                v-model.trim="user.username"
                :class="{ 'p-invalid': submitted && v$.username.$error }"
                autofocus
                class="w-full" placeholder="Ingresa tu nombre de usuario"
                style="padding: 1rem"
                type="text"
            />
            <div class="error-container">
              <small v-for="error of v$.username.$errors" :key="error.$uid" class="p-error">{{ getCustomError("username", error.$validator, error) + ". " }}</small>
            </div>


            <label class="block text-900 font-medium mb-2 mt-1" for="password1">Contraseña <span
                class="required">*</span></label>
            <Password
                id="password1"
                v-model="user.password"
                :class="{ 'p-invalid': submitted && v$.password.$error }"
                :feedback="false"
                :inputStyle="{ padding: '1rem' }"
                :toggleMask="true"
                autofocus
                class="w-full"
                inputClass="w-full"
                placeholder="Al menos 8 caracteres y 1 mayus"
            >
            </Password>
            <div class="error-container">
              <small v-for="error of v$.password.$errors" :key="error.$uid" class="p-error">{{ getCustomError("password", error.$validator, error) + ". " }}</small>
            </div>

            <label class="block text-900 font-medium mb-2 mt-1" for="password2">Confirmar Contraseña <span
                class="required">*</span></label>
            <Password
                id="password2"
                v-model="user.confirmedPassword"
                :class="{ 'p-invalid': submitted && v$.confirmedPassword.$error }"
                :feedback="false"
                :inputStyle="{ padding: '1rem' }"
                :toggleMask="true"
                autofocus
                class="w-full"
                inputClass="w-full"
                placeholder="Al menos 8 caracteres y 1 mayus"
            >
            </Password>
            <div class="error-container">
              <small v-for="error of v$.confirmedPassword.$errors" :key="error.$uid" class="p-error">{{ getCustomError("confirmedPassword", error.$validator, error) + ". " }}</small>
            </div>

            <Button :disabled="isProcessingRequest" class="w-full p-3 mt-5" label="Registrarse" type="submit"></Button>
            <div class="text-center w-100 mt-2">
              <router-link class="font-medium no-underline m-auto cursor-pointer" style="color: var(--primary-color)"
                           to="/login">¿Ya tienes cuenta? Ingresa
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.required {
  color: #9b2a3a;
}

.error-container {
  height: 1.5rem; /* Establece una altura fija para el contenedor de mensajes de error */
  display: flex; /* Usa Flexbox para alinear verticalmente los mensajes de error */
  flex-direction: column; /* Alinea los mensajes de error en una columna */
  justify-content: center; /* Centra verticalmente los mensajes de error */
  margin-top: 0.5rem;
}
</style>