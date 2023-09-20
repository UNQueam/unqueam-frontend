<script setup>
import {ref} from 'vue';

import {useVuelidate} from '@vuelidate/core';
import {email, helpers, required} from '@vuelidate/validators';
import {getCustomError} from '@/utils/FormErrorMessageHandler';


const passwordRegexVal = (value) =>  {
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
  email: { required, email }, 
  username: { required },
  password: { 
    required,
    passwordRegexVal: helpers.withMessage("La contraseña debe contener al menos 8 caracteres y 1 Mayuscula", passwordRegexVal)
   },
  confirmedPassword: {
    required,
    sameAsPassword: (value) => value === user.value.password,
  },
};



const $externalResults = ref({})

const submitted = ref(false);

//REEMPLAZAR ESTE DICCIONARIO CON LOS ERRORES PROVENIENTES DEL BACKEND.
const a = {
  "email": ["email repetido", "a"], 
}

$externalResults.value = a;

const v$ = useVuelidate(rules, user, { $externalResults });

const submitForm = () => {
  submitted.value = true;
  v$.value.$validate();
  console.log(v$.value.$error);
  if (!v$.value.$error) {
        // if ANY fail validation
        alert('Form successfully submitted.')
      } else {
        alert('Form failed validation')
      }
  console.log(v$);
    if (v$.value.$invalid) { //ASI SABES SI ES INVALIDO.
      return console.log("invalid");
    }
}



</script>

<template>
    <div class="flex flex-column align-items-center justify-content-center mt-8 col-11 m-auto">
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full surface-card py-7 px-5 sm:px-8" style="border-radius: 53px">
          <div class="text-center mb-6">
            <div class="text-900 text-2xl font-medium mb-3">Registro</div>
            <span class="text-600 font-medium">Crea tu cuenta para continuar</span>
          </div>

          <div>
            <div class="field p-fluid mb-5">
                <label class="block text-900 font-medium mb-2" for="email1">Email <span class="required">*</span></label>
                <InputText 
                    id="email1" 
                    v-model.trim="user.email" 
                    class="w-full" 
                    placeholder="Ingresa tu correo electronico" 
                    style="padding: 1rem" type="text" 
                    autofocus
                    :class="{ 'p-invalid': submitted && v$.email.$error }"
                />
                
                <small v-for="error of v$.email.$errors" :key="error.$uid" class="p-error">{{ getCustomError("email",error.$validator, error) + ". " }} <br> </small>
            </div>
            <div class="md:w-30rem">
            </div>
            
            <div class="field p-fluid mb-5">
                <label class="block text-900 font-medium mb-2" for="username">Usuario <span class="required">*</span></label>
                <InputText 
                    id="username" 
                    v-model.trim="user.username" 
                    class="w-full" 
                    placeholder="Ingresa tu nombre de usuario" 
                    style="padding: 1rem" type="text" 
                    autofocus
                    :class="{ 'p-invalid': submitted && v$.username.$error }"
                />
                <small  v-for="error of v$.username.$errors" :key="error.$uid" class="p-error">{{ getCustomError("username",error.$validator,error) + ". " }} <br> </small>

            </div>

            <div class="field p-fluid mb-5">
                <label class="block text-900 font-medium mb-2" for="password1">Contraseña <span class="required">*</span></label>
                <Password 
                    id="password1" 
                    v-model="user.password" 
                    :feedback="false" 
                    :inputStyle="{ padding: '1rem' }" 
                    :toggleMask="true"
                    :class="{ 'p-invalid': submitted && v$.password.$error }"
                    class="w-full" 
                    inputClass="w-full"
                    autofocus 
                    placeholder="Al menos 8 caracteres y 1 mayus"
                    >
                </Password>
                <small  v-for="error of v$.password.$errors" :key="error.$uid" class="p-error">{{ getCustomError("password",error.$validator, error) + ". " }} <br> </small>
            </div>

            <div class="field p-fluid mb-3">
                <label class="block text-900 font-medium mb-2" for="password2">Confirmar Contraseña <span class="required">*</span></label>
                <Password 
                    id="password2" 
                    v-model="user.confirmedPassword" 
                    :feedback="false" 
                    :inputStyle="{ padding: '1rem' }" 
                    :toggleMask="true"
                    :class="{ 'p-invalid': submitted && v$.confirmedPassword.$error }" 
                    class="w-full" 
                    inputClass="w-full"
                    autofocus 
                    placeholder="Al menos 8 caracteres y 1 mayus"
                    >
                </Password>
                  <small  v-for="error of v$.confirmedPassword.$errors" :key="error.$uid" class="p-error">{{ getCustomError("confirmedPassword",error.$validator,error) + ". " }}<br> </small>
            </div>

            <Button class="w-full p-3 mt-5" label="Registrarse" @click="submitForm"></Button>
            <div class="text-center w-100 mt-2">
                <router-link class="font-medium no-underline m-auto cursor-pointer" style="color: var(--primary-color)" to="/login">¿Ya tienes cuenta? Ingresa</router-link>
            </div>

          </div>
        </div>
      </div>
    </div>
</template>

<style scoped>

.required {
  color: #9b2a3a;
}
</style>