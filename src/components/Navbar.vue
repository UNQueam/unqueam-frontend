<template>
  <nav class="navbar">
      <div class="navbar-logo">
      <router-link to="/" >
        <img src="/public/Unqueam_logo_image.png" alt="Logo" class="m-0 p-0" />
      </router-link>
      <span class="hidden md:visible md:inline logo-name">
        <router-link to="/"><span class="red-text">UN</span>Queam</router-link>
      </span>
    </div>
      <div class="navbar-links">
      <ul>
        <li v-if="authStore.isAdmin()" data-testid="admin_menu">
          <span aria-controls="overlay_menu" aria-haspopup="true" class="cursor-pointer" @click="toggle_admin">Admin</span>
          <Menu id="overlay_menu" ref="menu_admin" :model="admin_items" :popup="true" />
        </li>
        <li><router-link to="/">Juegos</router-link></li>
        <li v-if="!isUserAuthenticated"><router-link to="/login">Iniciar sesión</router-link></li>
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
              <button v-if="authStore.isUser()" class="w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround" @click="showBeDeveloperModal = true">
                <i class="pi pi-box" />
                <span class="ml-2">Ser desarrollador</span>
              </button>
              <button  class="w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround" @click="goToFavourites">
                <i class="pi pi-folder" />
                <span class="ml-2">Mis Favoritos</span>
              </button>
              <button v-if="authStore.isDeveloper()" class="w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround" @click="handleGoToDeveloperGames">
                <i class="pi pi-box" />
                <span class="ml-2">Mis Juegos</span>
              </button>
              <hr class="my-2" v-if="authStore.isUser()"/>
              <button class="w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround" @click="handleLogout">
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
  <Dialog v-model:visible="showBeDeveloperModal" class="m-3 lg:w-30rem" header="Convertirme en desarrollador" modal @after-hide="closeModalToBeDeveloper">
    <p>
      Al unirte a la comunidad de desarrolladores podrás publicar tus juegos para alcanzar usuarios que naveguen en la plataforma y poder recibir valoraciones y comentarios, a la vez de popularidad.
    </p>
    <form class="flex flex-column gap-2 mt-5" @submit.prevent="sendRequestToBeDeveloper">
              <label for="username">Motivo para ser desarrollador</label>
                <InputText id="value" v-model="reasonToBeDeveloper" class="w-full" placeholder="Quiero ser desarrollador porque ..." type="text"/>
      <small class="p-error" >{{ errorMessage || '&nbsp;' }}</small>
      <div class="w-full flex justify-content-end">
        <Button label="Cerrar" class="p-2 cancel-button" text @click="closeModalToBeDeveloper" />
        <Button class="p-2 ml-2" :loading="isProcessingRequestToBeDeveloper" icon="pi pi-check" label="Enviar solicitud" type="submit" />

      </div>
    </form>
  </Dialog>
  <ConfirmDialog></ConfirmDialog>
  <Toast group="tr" position="top-right" />
</template>

<script setup>

import {useAuthStore} from "@/stores/authStore";

import {computed, ref} from "vue";
import {useConfirm} from "primevue/useconfirm";
import {useRouter} from "vue-router";
import AuthenticationService from "@/service/AuthenticationService";
import {useToast} from "primevue/usetoast";
import Toast from "primevue/toast";
import {processRequestToBeDeveloper} from "@/service/DeveloperRequestsService";

let toast = useToast();
let authStore = useAuthStore()

const router = useRouter()
const authService = new AuthenticationService()

/* Functions and variables related to Modal for send request to be developer */
const showBeDeveloperModal = ref(false)
const reasonToBeDeveloper = ref("")
const isProcessingRequestToBeDeveloper = ref(false)
const errorMessage = ref("")

function closeModalToBeDeveloper() {
  errorMessage.value = ""
  showBeDeveloperModal.value = false
  reasonToBeDeveloper.value = ""
  isProcessingRequestToBeDeveloper.value = false
}

async function sendRequestToBeDeveloper() {
  errorMessage.value = ""

  if (reasonToBeDeveloper.value.length === 0) {
    errorMessage.value = "Debes ingresar una razón por la cual quieres ser desarrollador."
  } else {
    try {
      isProcessingRequestToBeDeveloper.value = true
      await processRequestToBeDeveloper(reasonToBeDeveloper.value)
      showBeDeveloperModal.value = false
      reasonToBeDeveloper.value = ""
      showSucessRequestToBeDeveloper()
    } catch (error) {
      errorMessage.value = error.message
    } finally {
      isProcessingRequestToBeDeveloper.value = false
    }
  }
}

const showSucessRequestToBeDeveloper = () => {
  toast.add({ severity: 'success', summary: 'Operación exitosa', detail: 'Tú solicitud fue enviada correctamente. En breve, un administrador la revisara.', group: 'tr', life: 7000 });
};
/* End variables and functions - request to be developer */

const menu = ref();
const menu_admin = ref();

const items = ref([
  { separator: true }
]);

const admin_items = ref([
  {
    label: 'Acciones',
    items: [
      {
        label: 'Usuarios',
        icon: 'pi pi-users',
        command: () => router.push("/admin/users")
      },
      {
        label: 'Solicitudes',
        icon: 'pi pi-inbox',
        command: () => router.push("/admin/requests")
      },
      {
        label: 'Banners',
        icon: 'pi pi-images',
        command: () => router.push("/admin/banners")
      }
    ]
  }
])

const toggle = (event) => {
  menu.value.toggle(event);
};

const toggle_admin = (event) => {
  menu_admin.value.toggle(event);
};

const isUserAuthenticated = computed(() => authStore.isAuthenticated());

const confirm = useConfirm();

const handleLogout = () => {
  confirm.require({
    message: '¿Estás seguro que deseas cerrar la sesión?',
    header: 'Sesión',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí, cerrar sesión',
    rejectLabel: 'Cancelar',
    accept: async () => {
      try {
        await authService.logout();
        router.push({path: '/login', query: {logout: true}});
      } catch (error) {
        //do nothing
      }
    }
  });
};

const handleGoToDeveloperGames = () => {
  router.push({path: '/dev/games'});
};

const goToFavourites = () => {
  router.push({path: '/my-favourites'});
}

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
  font-family: sans-serif;
  font-size: 20px;
  display: flex;
  align-items: center;
  text-decoration: none;
}

.red-text {
  color: #b22429;
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

.cancel-button {
  width: 100px;
  background-color: rgba(255, 255, 255, 0.87);
  border: none;
  color: #9b2a3a;
  transition: background-color 0.3s, color 0.3s;
}

.cancel-button:hover {
  background-color: rgba(255, 255, 255, 1) !important;
  color: #FF0000 !important;
}
</style>
