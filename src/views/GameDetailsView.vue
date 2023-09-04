<script setup>

const isUserPlaying = ref(false);

const gameIframe = ref(null);
const toggleFullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    gameIframe.value.requestFullscreen().catch(error => {
      console.error('Error al habilitar pantalla completa:', error);
    });
  }
};

function executePlay() {
  isUserPlaying.value = true
}

import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchGame } from "@/service/GamesService"

const route = useRoute();
const gameId = ref('');
const gameData = ref(null);

const getDeveloperNames = (developers) => {
  if(developers) {
    const nameStrings = developers.map(item => `${item.firstName} ${item.lastName}`);
    return nameStrings.join(', ');
  }
  
}

onMounted(async () => {
  gameId.value = route.params.id;

  try {
    const response = await fetchGame(gameId.value);
    gameData.value = response;
  } catch (error) {
    console.error('Error al cargar el juego:', error);
  }
})

</script>

<template>
  <div class="flex">
    <div class="card mb-5 m-auto mt-5 w-100">
        <h1>{{gameData?.name}}</h1>
        <div v-if="!isUserPlaying" class='game-preview'>
          <button class='play-button' @click="executePlay">
            <span id='play-button-text'>Play</span>
            <i class="play-icon pi pi-play" style="color: #b3b3b3"></i>
          </button>
        </div>
        <div v-if="isUserPlaying" class="gameplay flex flex-column">
          <iframe ref="gameIframe" class="game" src="https://emilianaailen.github.io/boss-vainilla/"></iframe>
          <button class="p-2 mt-3" @click="toggleFullscreen">Pantalla completa</button>
        </div>

        <div class='game-images-container'>
          <Image v-for="(image, index) in gameData?.images" :key="index" :src="image.url" alt="Image" width="200" preview />
        </div>
        <div>
          <div class="font-medium text-3xl text-900 mb-3">Game Information</div>
          <div class="text-500 mb-5">{{gameData?.description}}</div>
          <ul class="list-none p-0 m-0">
            <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
              <div class="text-500 w-6 md:w-2 font-medium">Title</div>
              <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{gameData?.name}}</div>
            </li>
            <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
              <div class="text-500 w-6 md:w-2 font-medium">Genres</div>
              <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                <Chip v-for="(genre, index) in gameData?.genres" :key="index" :label="genre" class="mr-2"></Chip>
              </div>
            </li>
            <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
              <div class="text-500 w-6 md:w-2 font-medium">Dev Team</div>
              <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{gameData?.developmentTeam}}</div>
            </li>
            <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
              <div class="text-500 w-6 md:w-2 font-medium">Developers</div>
              <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ getDeveloperNames(gameData?.developers) }}</div>
            </li>
          </ul>
        </div>
      </div>
  </div>
</template>

<style>
.game {
  width: 100%;
  height: 100%;
  border: none;
}

.play-icon {
  font-size: 14pt;
  background-color: #666666;
  border: 1px solid #858585;
  padding: 0.8rem 1.5rem;
  border-radius: 8px
}

.play-button {
  border: 0;
  background: none;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
}

.play-button:hover {
  cursor: pointer;
}

#play-button-text {
  font-size: 48px;
  color: #c1272d
}

.game-preview {
  background-color: black;
  width: 100%;
  height: 500px;
  margin: 2rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.gameplay {
  width: 100%;
  height: 600px;
  margin: 2rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-images-container {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin-bottom: 2rem;
}
</style>