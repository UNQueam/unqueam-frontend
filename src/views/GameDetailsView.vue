<script setup>
import {ref} from 'vue'

const isUserPlaying = ref(false)

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

</script>

<template>
  <div class="flex ">
      <div class="card mb-5 m-auto mt-5 w-100">
        <h1>League Of Legends</h1>

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
          <Image src="https://th.bing.com/th/id/R.76f0763f35b9ef55d0a8919c7849d026?rik=Nxu189bBsslFeg&pid=ImgRaw&r=0" alt="Image" width="200" preview />
          <Image src="https://wallpapercave.com/wp/wp9493361.jpg" alt="Image" width="200" preview />
          <Image src="https://images3.alphacoders.com/691/thumb-1920-691287.jpg" alt="Image" width="200" preview />
        </div>
        <div>
          <div class="font-medium text-3xl text-900 mb-3">Game Information</div>
          <div class="text-500 mb-5">Morbi tristique blandit turpis. In viverra ligula id nulla hendrerit rutrum.</div>
          <ul class="list-none p-0 m-0">
            <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
              <div class="text-500 w-6 md:w-2 font-medium">Title</div>
              <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">Heat</div>
            </li>
            <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
              <div class="text-500 w-6 md:w-2 font-medium">Genre</div>
              <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                <Chip label="Crime" class="mr-2"></Chip>
                <Chip label="Drama" class="mr-2"></Chip>
                <Chip label="Thriller"></Chip>
              </div>
            </li>
            <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
              <div class="text-500 w-6 md:w-2 font-medium">Director</div>
              <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">Michael Mann</div>
            </li>
            <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
              <div class="text-500 w-6 md:w-2 font-medium">Actors</div>
              <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">Robert De Niro, Al Pacino</div>
            </li>
            <li class="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 surface-border flex-wrap">
              <div class="text-500 w-6 md:w-2 font-medium">Plot</div>
              <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                A group of professional bank robbers start to feel the heat from police
                when they unknowingly leave a clue at their latest heist.</div>
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