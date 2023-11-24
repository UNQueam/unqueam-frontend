<template>
  <nav v-show="isMobile">
    <div class="flex flex-row justify-content-between">
      <div class="navbar-links">
        <Sidebar v-model:visible="showSideBar">
          <template #container="">
            <div class="flex flex-column h-full">
              <div class="flex align-items-center justify-content-between px-4 pt-3 flex-shrink-0">
                          <span class="inline-flex align-items-center gap-2">
                              <img src="/public/Unqueam_logo_image.png" alt="Logo" class="m-0 p-0" width="40"/>
                              <span class="font-semibold text-2xl text-primary"><span class="red-text">UN</span><span class="text-gray-100">Queam</span></span>
                          </span>
                <span>
                              <Button type="button" @click="showSideBar = false" icon="pi pi-times" rounded outlined class="h-2rem w-2rem mt-2"></Button>
                          </span>
              </div>
              <div class="overflow-y-auto">
                <ul class="list-none p-3 m-0">
                  <li>
                    <a @click="handleCloseSidebar(() => router.push('/'))" v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                      <span class="font-medium">Ir a inicio</span>
                    </a>
                  </li>
                  <router-link to="/login" v-if="!isUserAuthenticated" class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                    <span class="font-medium">Iniciar sesión</span>
                  </router-link>
                </ul>
                <ul v-if="authStore.isAdmin()" class="list-none p-3 m-0">
                  <li class="font-medium">Admin</li>
                  <li>
                    <a @click="handleCloseSidebar(() => router.push('/admin/users'))" v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                      <i
                          class="pi pi-users mr-2 p-1"
                          style="border-radius: 50%; border: 2px solid #747475; color: #848588;"
                      />
                      <span class="font-medium">Usuarios</span>
                    </a>
                    <a @click="handleCloseSidebar(() => router.push('/admin/requests'))" v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                      <i
                          class="pi pi-inbox mr-2 p-1"
                          style="border-radius: 50%; border: 2px solid #747475; color: #848588;"
                      />
                      <span class="font-medium">Solicitudes</span>
                    </a>
                    <a @click="handleCloseSidebar(() => router.push('/admin/banners'))" v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                      <i
                          class="pi pi-inbox mr-2 p-1"
                          style="border-radius: 50%; border: 2px solid #747475; color: #848588;"
                      />
                      <span class="font-medium">Banners</span>
                    </a>
                  </li>
                </ul>
                <ul v-if="authStore.isAuthenticated()" class="list-none p-3 m-0">
                  <li class="font-medium">Usuario</li>
                  <li>
                    <a v-if="authStore.isUser()" @click="handleCloseSidebar(() => showBeDeveloperModal = true)" v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                      <i
                          class="pi pi-box mr-2 p-1"
                          style="border-radius: 50%; border: 2px solid #747475; color: #848588;"
                      />
                      <span class="font-medium">Ser desarrollador</span>
                    </a>
                    <a @click="handleCloseSidebar(goToFavourites)" v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                      <i
                          class="pi pi-folder mr-2 p-1"
                          style="border-radius: 50%; border: 2px solid #747475; color: #848588;"
                      />
                      <span class="font-medium">Mis favoritos</span>
                    </a>
                    <a @click="handleCloseSidebar(handleGoToDeveloperGames)" v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                      <i
                          class="pi pi-box mr-2 p-1"
                          style="border-radius: 50%; border: 2px solid #747475; color: #848588;"
                      />
                      <span class="font-medium">Mis juegos</span>
                    </a>
                    <a @click="handleCloseSidebar(handleLogout)" v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                      <i
                          class="pi pi-sign-out mr-2 p-1"
                          style="border-radius: 50%; border: 2px solid #747475; color: #848588;"
                      />
                      <span class="font-medium">Cerrar sesión</span>
                    </a>
                  </li>
                </ul>
              </div>
              <div class="mt-auto" v-if="authStore.isAuthenticated()">
                <hr class="mb-3 mx-3 border-top-1 border-none surface-border" />
                <a v-ripple class="m-3 flex align-items-center cursor-pointer p-3 gap-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                  <Avatar :image="getAvatarImage(avatarKey)" shape="circle" class="mr-2"
                          style="background-color: #0b0b0b; border: 1px solid #c1272d; border-radius: 50%" />
                  <span class="font-bold">{{ authStore.getUsername }}</span>
                </a>
              </div>
            </div>
          </template>
        </Sidebar>
        <Button class="m-4" icon="pi pi-bars" @click="showSideBar = true"></Button>
      </div>
      <div class="navbar-logo mr-3">
        <router-link to="/">
          <img src="/public/Unqueam_logo_image.png" alt="Logo" class="m-0 p-0"/>
        </router-link>
        <span class="hidden md:visible md:inline logo-name">
          <router-link to="/"><span class="red-text">UN</span>Queam</router-link>
        </span>
      </div>
    </div>
  </nav>

  <nav v-show="!isMobile" class="navbar">
    <div class="navbar-logo">
      <router-link to="/">
        <img src="/public/Unqueam_logo_image.png" alt="Logo" class="m-0 p-0"/>
      </router-link>
      <span class="hidden md:visible md:inline logo-name">
        <router-link to="/"><span class="red-text">UN</span>Queam</router-link>
      </span>
    </div>
    <div class="navbar-links">
      <ul>
        <router-link to="/" class="navbar-item flex flex-row gap-2 align-items-center">
          <i
              class="pi pi-th-large p-1"
              style="border-radius: 50%; border: 2px solid #747475; color: #848588;"
          />
          <span>Juegos</span>
        </router-link>
        <li v-if="authStore.isAdmin()" @click="toggle_admin" data-testid="admin_menu" class="navbar-item flex flex-row gap-2 align-items-center font-bold" aria-controls="overlay_menu" aria-haspopup="true">
          <i
              class="pi pi-cog p-1"
              style="border-radius: 50%; border: 2px solid #747475; color: #848588;"
          />
          <span>Admin</span>
          <i class="pi pi-chevron-down text-sm opacity-70 mt-1"/>
          <Menu id="overlay_menu" ref="menu_admin" :model="admin_items" :popup="true"/>
        </li>

        <router-link to="/login" v-if="!isUserAuthenticated" class="navbar-item flex flex-row gap-2 align-items-center">
          <i class="pi pi-user p-1" style="border-radius: 50%; border: 2px solid #747475; color: #848588"/>
          <span>Iniciar sesión</span>
        </router-link>
          <li
              v-if="isUserAuthenticated"
              aria-controls="overlay_menu"
              aria-haspopup="true"
              class="navbar-item navbar-item flex flex-row gap-2 align-items-center font-bold"
              @click="toggle"
              data-cy="nav-username"
          >
            <Avatar :image="getAvatarImage(authStore.getProfileImageId)" shape="circle"
                    style="background-color: #0b0b0b; border: 1px solid #c1272d; border-radius: 50%" />
            {{ authStore.getUsername }}
            <i class="pi pi-chevron-down text-sm opacity-70 mt-1"/>
          </li>
          <Menu id="overlay_menu" ref="menu" class="w-fit pr-2" :model="items" :popup="true">
            <template #start>
              <div class="w-full flex align-items-center p-2 pl-3 text-color">
                <Avatar
                    :image="getAvatarImage(authStore.getProfileImageId)"
                    shape="circle"
                    class="mr-2"
                    size="xlarge"
                    style="background-color: #0b0b0b; border: 1px solid #c1272d; border-radius: 50%"
                    v-on:mouseover="showEditIcon = true"
                    v-on:mouseout="showEditIcon = false"
                    >
                  <i
                      v-if="showEditIcon"
                      v-tooltip.left="'Cambiar avatar'"
                      class="pi pi-pencil edit-icon"
                      @click="shouldShowChangeAvatarDialog = true"
                  />

                </Avatar>

                <div class="flex flex-column align gap-1">
                  <span class="font-bold text-2xl">{{ authStore.getUsername }}</span>
                  <span class="text-sm">{{ authStore.getUserRole }}</span>
                </div>
              </div>
            </template>

            <template #end>
              <button v-if="authStore.isUser()"
                      class="w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround"
                      @click="showBeDeveloperModal = true">
                <i class="pi pi-box"/>
                <span class="ml-2">Ser desarrollador</span>
              </button>
              <button class="w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround"
                      @click="shouldShowProfileDialog = true">
                <i class="pi pi-user"/>
                <span class="ml-2">Mí Perfil</span>
              </button>
              <button class="w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround"
                      @click="goToFavourites">
                <i class="pi pi-folder"/>
                <span class="ml-2">Mis Favoritos</span>
              </button>
              <button v-if="authStore.isDeveloper()"
                      class="w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround"
                      @click="handleGoToDeveloperGames">
                <i class="pi pi-box"/>
                <span class="ml-2">Mis Juegos</span>
              </button>
              <hr class="my-2" v-if="authStore.isUser()"/>
              <button class="w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround"
                      @click="handleLogout">
                <i class="pi pi-sign-out"/>
                <span class="ml-2">Cerrar sesión</span>
              </button>
            </template>
          </Menu>
          <Toast/>
        <UserProfileDialog
            v-bind:avatarKey="avatarKey"
            :visible="shouldShowProfileDialog"
            :editable="true"
            :userId="authStore.getUserId"
            :close="() => {shouldShowProfileDialog = false}"
        />
        <ChangeAvatarDialog
            v-if="shouldShowChangeAvatarDialog"
            :visible="shouldShowChangeAvatarDialog"
            :close="() => {shouldShowChangeAvatarDialog = false}"
            :onUpdate="(key) => updateAvatarKey(key)"
        />
      </ul>
    </div>
  </nav>
  <Dialog v-model:visible="showBeDeveloperModal" class="m-3 lg:w-30rem" header="Convertirme en desarrollador" modal
          @after-hide="closeModalToBeDeveloper">
    <p>
      Al unirte a la comunidad de desarrolladores podrás publicar tus juegos para alcanzar usuarios que naveguen en la
      plataforma y poder recibir valoraciones y comentarios, a la vez de popularidad.
    </p>
    <form class="flex flex-column gap-2 mt-5" @submit.prevent="sendRequestToBeDeveloper">
      <label for="username">Motivo para ser desarrollador</label>
      <InputText id="value" v-model="reasonToBeDeveloper" class="w-full"
                 placeholder="Quiero ser desarrollador porque ..." type="text"/>
      <small class="p-error">{{ errorMessage || '&nbsp;' }}</small>
      <div class="w-full flex justify-content-end">
        <Button label="Cerrar" class="p-2 cancel-button" text @click="closeModalToBeDeveloper"/>
        <Button class="p-2 ml-2" :loading="isProcessingRequestToBeDeveloper" icon="pi pi-check" label="Enviar solicitud"
                type="submit"/>

      </div>
    </form>
  </Dialog>
  <ConfirmDialog></ConfirmDialog>
  <Toast group="tr" position="top-right"/>
</template>

<script setup>

import {useAuthStore} from "@/stores/authStore";
import Sidebar from "primevue/sidebar";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {useConfirm} from "primevue/useconfirm";
import {useRouter} from "vue-router";
import AuthenticationService from "@/service/AuthenticationService";
import {useToast} from "primevue/usetoast";
import Toast from "primevue/toast";
import {processRequestToBeDeveloper} from "@/service/DeveloperRequestsService";
import {getAvatarImage} from "@/service/AvatarKeysResolver";
import UserProfileDialog from "@/components/UserProfileDialog.vue";
import ChangeAvatarDialog from "@/components/ChangeAvatarDialog.vue";

const handleCloseSidebar = (functionToExecute) => {
  functionToExecute()
  showSideBar.value = false
}

/* Dialogs: ChangeAvatar and UserProfile */

const shouldShowChangeAvatarDialog = ref(false)
const shouldShowProfileDialog = ref(false)

const avatarKey = ref()

const updateAvatarKey = (key) => {
  avatarKey.value = key
}

/* End dialogs */

const isMobile = ref(false);
const showSideBar = ref(false)

let toast = useToast();
let authStore = useAuthStore()

const showEditIcon = ref(false);

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
  toast.add({
    severity: 'success',
    summary: 'Operación exitosa',
    detail: 'Tú solicitud fue enviada correctamente. En breve, un administrador la revisara.',
    group: 'tr',
    life: 7000
  });
};
/* End variables and functions - request to be developer */

const menu = ref();
const menu_admin = ref();

const items = ref([
  {separator: true}
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

const checkIfMobile = () => {
  isMobile.value = window.innerWidth < 550;
};

onMounted(() => {
  checkIfMobile();
  window.addEventListener('resize', checkIfMobile);
  avatarKey.value = authStore.getProfileImageId;
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkIfMobile);
});

</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0b0b0b;
  color: white;
  padding: 0 5rem;
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
  display: flex;
  gap: 5px;
}

.edit-icon {
  font-size: 1.1rem;
  position: absolute;
  color: #ffffff;
  cursor: pointer;
  padding: 2rem;
  border-radius: 50%;
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

.navbar-item {
  padding: 0.8rem 1rem;
  border-radius: 8px;
}

.navbar-item:hover {
  background-color: #23252b;
  cursor:pointer;
}
</style>
