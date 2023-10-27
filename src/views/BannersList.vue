<script setup>
import DataView from 'primevue/dataview';
import 'primeflex/primeflex.css';

import {computed, onBeforeMount, ref} from "vue";
import {exposeGame, fetchDeveloperGames, hideGame} from "@/service/GamesService"
import {useAuthStore} from "@/stores/authStore";
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";

const router = useRouter()

const authStore = useAuthStore();

const games = ref([]);

const toast = useToast();

const inputKey = ref('');

onBeforeMount(async () => {
  try {
    games.value = await fetchDeveloperGames(authStore.getUsername);
    games.value = [{
      id: 1,
      name: "Estadisticas de los jugadores de overwatch a lo largo de latinoamerica",
      image: "https://elcomercio.pe/resizer/oAQExsuvFUNs3Dzt7i6lmi4fXVA=/1200x900/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/PAVQWATNQ5D5FNEBHIMXZZX554.jpg"}]
  } catch (err) {
    //do nothing
  }
});

const showToggleHideStatusSuccess = () => {
  toast.add({ severity: 'success', summary: 'Estado cambiado', detail: 'Se ha cambiado satisfactoriamente el estado del juego', life: 5000 });
}
const showToggleHideStatusFailure = () => {
  toast.add({ severity: 'error', summary: 'Estado no cambiado', detail: 'Algo ha ocurrido, intenta nuevamente mas tarde', life: 5000 });
}

const isHideSwitcherEnabled = ref(true);

const toggleSwitcher = async (gameId) => {
  const game = games.value.filter(game => game.id === gameId)[0]
  if (isHideSwitcherEnabled.value) {
    isHideSwitcherEnabled.value = false;
    setTimeout(() => {
      isHideSwitcherEnabled.value = true;
    }, 2000);
  }
  try {
    const isHidden = game.is_hidden;
    if (isHidden) {
      await exposeGame(gameId);
      showToggleHideStatusSuccess();
    } else {
      await hideGame(gameId);
      showToggleHideStatusSuccess();
    }
    games.value[games.value.indexOf(game)].is_hidden = !isHidden;
  } catch (error) {
    showToggleHideStatusFailure();
  }
};

const goToGame = (gameId) => {
  router.push("/games/" + gameId)
}

const stopPropagation = (event) => {
  event.stopPropagation();
}

const iconClass = computed(() => {
  if (! isHideSwitcherEnabled.value) {
    return 'pi pi-spinner pi-spin';
  } else {
    return 'pi pi-ban';
  }
});

const goToNewGameForm = () => {
  router.push("/dev/games/publish")
}

const editGame = (gameAlias) => {
  router.push("/dev/games/"+ gameAlias + "/edit")
}

const filteredData = computed(() => {
  const lowerCaseFilter = inputKey.value.toLowerCase()
  return games.value.filter(
      (item) =>
          item.name.toLowerCase().includes(lowerCaseFilter)
  )
})

</script>

<template>
  <div class="col-9 m-auto surface-section px-4 py-5 md:px-6 lg:px-8">
    <ul class="list-none p-0 m-0 flex align-items-center font-medium mb-3">
      <li>
        <router-link to="/" class="text-500 no-underline line-height-3 cursor-pointer">Home</router-link>

      </li>
      <li class="px-2">
        <i class="pi pi-angle-right text-500 line-height-3"></i>
      </li>
      <li>
        <span class="text-900 line-height-3">Banners</span>
      </li>
    </ul>
    <div class="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
      <div class="font-medium text-3xl text-900">Banners</div>
      <div class="mt-3 lg:mt-0">
        <Button class=" mr-2" icon="pi pi-plus" label="Publicar" @click="goToNewGameForm"></Button>
      </div>
    </div>
  </div>
  <div class="card col-9 m-auto mt-5">
    <DataView :value="filteredData" paginator :rows="5">
      <template #header>
        <div class="flex sm:flex-column md:flex-column lg:flex-row flex-wrap gap-4">
          Poner filtro?
        </div>
      </template>
      <template #empty >
        <div  class="no-games mb-5 mt-5"> No se encontraron juegos. </div>
      </template>
      <template #list="slotProps">
        <div class="col-12 clickeable-item" @click="goToGame(slotProps.data.id)">
          <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4 h-full">
            <img class=" " style="max-height: 160px; min-height: 160px; object-fit:cover;" :src="slotProps.data.image" :alt="slotProps.data.name" />
            <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4 h-full">
              <div class="font-bold text-5xl m-auto" style="font-size: 15px;">{{ slotProps.data.name }}</div>
              <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2" @click="stopPropagation">
                <Button icon="pi pi-pencil" rounded v-tooltip="'Editar juego'" @click="editGame(slotProps.data.alias)"></Button>
                <label v-tooltip="slotProps.data.is_hidden ? 'Exponer juego' : 'Ocultar juego'" class="switcher" @click="stopPropagation">
                  <input v-model="slotProps.data.is_hidden" type="checkbox" class="switcher-input" :disabled="!isHideSwitcherEnabled" @click="toggleSwitcher(slotProps.data.id)">
                  <span class="switcher-slider">
                    <span class="slider-circle">
                      <i :class="iconClass"></i>
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </div>
  <hr class="my-5 opacity-0">
  <Toast position="top-right"/>
</template>

<style scoped>
.switcher {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
  background-color: #2a2a2a;
  border-radius: 15px;
  overflow: hidden;
}

.switcher-input {
  display: none;
}

.switcher-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #2a2a2a;
  border-radius: 15px;
  transition: 0.4s;
}

.slider-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background-color: #717171;
  border-radius: 50%;
  transition: 0.4s;
  transform: translateX(0);
}

.switcher-slider i.pi-ban {
  color: white;
}

.switcher-input:checked + .switcher-slider .slider-circle {
  background-color: #9b2a3a;
  transform: translateX(30px);
}

.red {
  color: #9b2a3a;
}

.clickeable-item {
  cursor: pointer;
  transition: background-color 0.3s;
}



.clickeable-item:hover {
  animation: bounce 0.8s;
  background-color: #414141;
}

.image-container {
  width: 200px;
  height: 160px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}



@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}

.no-games {
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 18px;
  transition: color 0.3s;
}
</style>