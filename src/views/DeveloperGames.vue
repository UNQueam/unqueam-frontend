<script setup>
import DataView from 'primevue/dataview';
import 'primeflex/primeflex.css';

import {ref, computed, onBeforeMount} from "vue";
import {fetchDeveloperGames} from "@/service/GamesService"
import {useAuthStore} from "@/stores/authStore";

const authStore = useAuthStore();


const games = ref();
const inputKey = ref('');
const sortKey = ref();
const sortOrder = ref();
const sortField = ref();
const sortOptions = ref([
  {label: 'Valoraciones de mejor a peor', value: '!rating'},
  {label: 'Valoraciones de peor a mejor', value: 'rating'},
  {label: 'Comentarios de mayor a menor cantidad', value: '!comments'},
  {label: 'Comentarios de menor a mayor cantidad', value: 'comments'},
]);

onBeforeMount(async () => {
  try {
    games.value = await fetchDeveloperGames(authStore.getUsername);
  } catch (err) {
    //do nothing
  }
});

const onSortChange = (event) => {
  const value = event.value.value;
  const sortValue = event.value;

  if (value.indexOf('!') === 0) {
    sortOrder.value = -1;
    sortField.value = value.substring(1, value.length);
    sortKey.value = sortValue;
  }
  else {
    sortOrder.value = 1;
    sortField.value = value;
    sortKey.value = sortValue;
  }
};

  const isHideSwitcherEnabled = ref(true);

  const toggleSwitcher = () => {
    if (isHideSwitcherEnabled.value) {
      isHideSwitcherEnabled.value = false;
      setTimeout(() => {
        isHideSwitcherEnabled.value = true;
      }, 2000);
    }
  };

  const goToGame = () => {
    console.log("LETS GOOOOOOO");
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

</script>

<template>
  <div class="card col-9 m-auto mt-5">
    <DataView :value="games" paginator :rows="5" :sortOrder="sortOrder" :sortField="sortField">
      <template #header>
        <div class="flex justify-content-center mb-5 text-2xl font-bold text-900">
          Mis Juegos
        </div>
        <div class="flex sm:flex-column md:flex-column lg:flex-row flex-wrap gap-4">
          <div class="lg:col-4 md:col-3 sm:col-3">
            <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Selecciona un orden" @change="onSortChange($event)" />
          </div>
          <div class="lg:col-3 lg:col-offset-1 md:col-3 sm:col-3">
            <InputText style="width: 190px;" v-model="inputKey" placeholder="Buscar" />
          </div>
        </div>
      </template>
      <template #list="slotProps">
        <div class="col-12 clickeable-item" @click="goToGame">
          <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
            <img class=" product-image w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" :src="slotProps.data.logo_url" :alt="slotProps.data.name" />
            <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
              <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                <div class="text-2xl font-bold text-900 xl:w-10rem">{{ slotProps.data.name }}</div>
                <Rating :modelValue="slotProps.data.rating" readonly :cancel="false"></Rating>
                <div class="flex align-items-center gap-3">
                                    <span class="flex align-items-center gap-2">
                                        <span class="font-semibold">{{ slotProps.data.comments }} comentarios</span>
                                    </span>
                </div>
              </div>
              <div class="font-bold text-600" style="font-size: 15px;">{{ slotProps.data.description }}</div>
              <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                <Button icon="pi pi-pencil" rounded :disabled="slotProps.data.inventoryStatus === 'OUTOFSTOCK'"></Button>
                <label class="switcher" @click="stopPropagation">
                  <input type="checkbox" class="switcher-input" :disabled="!isHideSwitcherEnabled" @click="toggleSwitcher">
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

.clickeable-item {
  cursor: pointer;
  transition: background-color 0.3s;
}



.clickeable-item:hover {
  animation: bounce 0.8s;
  background-color: #414141;
}

.product-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
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
</style>