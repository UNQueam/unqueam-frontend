<script setup>
import DataView from 'primevue/dataview';
import 'primeflex/primeflex.css';

import {computed, onBeforeMount, ref} from "vue";
import {useAuthStore} from "@/stores/authStore";
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";
import {useConfirm} from "primevue/useconfirm";
import {doRemoveGameFromFavorites, fetchFavoriteGamesOfAuthUser} from "@/service/FavoriteGamesService";

const router = useRouter()

const authStore = useAuthStore();

const games = ref([]);
const commentsQuantity = ref(0);
const avgRating = ref(0);
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
const toast = useToast();
const confirm = useConfirm();

onBeforeMount(async () => {
  try {
    games.value = await fetchFavoriteGamesOfAuthUser()
    games.value = games.value.map(favGame => favGame.game)
    getGeneralMetrics();
  } catch (err) {
    //do nothing
  }
});

const getGeneralMetrics = () => {
  let sumOfAvgRatings = 0;
  let sumOfComments = 0;
  games.value.forEach(game => {
    if(game.comments) {
      if (getGameAvgRating(game.comments) >= 1){
        sumOfAvgRatings+= getGameAvgRating(game.comments);
      }
      sumOfComments+= game.comments.length
    }
  })
  commentsQuantity.value = sumOfComments;
  if (games.value.length) {
    avgRating.value = Math.max(1,Math.round(sumOfAvgRatings / games.value.length));
  }
  games.value = games.value.map(game => {
    return {...game, rating: getGameAvgRating(game.comments)}
  })
}

const getGameAvgRating = (comments) => {
  if (comments) {
    let ratingsSum = 0;
    comments.forEach((comment) => {
      ratingsSum+= comment.rating
    })
    return ratingsSum / comments.length
  }
  return 0;
}

const getCommentsQuantity = (comments) => {
  if (comments){
    return comments.length;
  }
  return 0;

}
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

const showRemovalStatusSuccess = () => {
  toast.add({ severity: 'success', summary: 'Estado cambiado', detail: 'Se ha quitado satisfactoriamente el juego de favoritos', life: 5000 });
}
const showRemovalStatusFailure = () => {
  toast.add({ severity: 'error', summary: 'Estado no cambiado', detail: 'Algo ha ocurrido, intenta nuevamente mas tarde', life: 5000 });
}

const goToGame = (gameId) => {
  router.push("/games/" + gameId)
}

const stopPropagation = (event) => {
  event.stopPropagation();
}

const filteredData = computed(() => {
  const lowerCaseFilter = inputKey.value.toLowerCase()
  return games.value.filter(
      (item) =>
          item.name.toLowerCase().includes(lowerCaseFilter)
  )
})

const confirmDialog = (gameId, event) => {
  confirm.require({
    target: event.currentTarget,
    message: '¿Estas seguro que deseas eliminar el juego de tus favoritos?',
    icon: 'pi pi-info-circle',
    acceptLabel: 'Sí. eliminar',
    rejectLabel: 'No',
    accept: async () => {
      try {
        await doRemoveGameFromFavorites(gameId)
        showRemovalStatusSuccess();
        games.value = games.value.filter(game => game.id !== gameId)
      } catch (error) {
        showRemovalStatusFailure();
      }
    }
  });
};

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
        <span class="text-900 line-height-3">Mis juegos</span>
      </li>
    </ul>
    <div class="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
      <div>
        <div class="font-medium text-3xl text-900">Mis Favoritos</div>
      </div>
    </div>
  </div>
  <div class="card col-9 m-auto mt-5">
    <DataView :value="filteredData" paginator :rows="5" :sortOrder="sortOrder" :sortField="sortField">
      <template #header>
        <div class="flex sm:flex-column md:flex-column lg:flex-row flex-wrap gap-4">
          <div class="lg:col-4 md:col-3 sm:col-3">
            <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Selecciona un orden" @change="onSortChange($event)" />
          </div>
          <div class="lg:col-3 lg:col-offset-1 md:col-3 sm:col-3">
            <InputText style="width: 190px;" v-model="inputKey" placeholder="Buscar" />
          </div>
        </div>
      </template>
      <template #empty >
        <div  class="no-games mb-5 mt-5"> No se encontraron juegos. </div>
      </template>
      <template #list="slotProps">
        <div class="col-12 clickeable-item" @click="goToGame(slotProps.data.alias)">
          <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
            <img class=" product-image w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" :src="slotProps.data.logo_url" :alt="slotProps.data.name" />
            <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
              <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                <div class="text-2xl font-bold text-900 xl:w-10rem">{{ slotProps.data.name }}</div>
                <Rating :modelValue="slotProps.data.rating" readonly :cancel="false"></Rating>
                <div class="flex align-items-center gap-3">
                                    <span class="flex align-items-center gap-2">
                                        <span class="font-semibold">{{ getCommentsQuantity(slotProps.data.comments) }} comentarios</span>
                                    </span>
                </div>
              </div>
              <div class="font-bold text-600" style="font-size: 15px;">{{ slotProps.data.description }}</div>
              <div class="flex sm:flex-column align-items-center sm:align-items-end" @click="stopPropagation">
                <Button class="dislike-button" icon="pi pi-heart" rounded v-tooltip="'Quitar de la biblioteca'"  @click="confirmDialog(slotProps.data.id, $event)"></Button>
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

.no-games {
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 18px;
  transition: color 0.3s;
}

.dislike-button {
  background-color: #717171;
  color: #2a2a2a;
  border: 0;
  transition: background-color 0.3s, color 0.3s;
}

.dislike-button:hover {
  background-color: #2a2a2a;
  color: #9b2a3a;
}
</style>