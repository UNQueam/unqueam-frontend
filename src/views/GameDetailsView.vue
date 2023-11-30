<script setup>

import {
  doRemoveGameFromFavorites,
  fetchFavoriteGamesOfAuthUser,
  postAddGameToFavorite
} from "@/service/FavoriteGamesService";
import {onBeforeUnmount, onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import {fetchGame} from "@/service/GamesService"
import GameCommentsCard from "@/components/GameCommentsCard.vue";
import {useAuthStore} from "@/stores/authStore";
import {TrackData,track, TrackingEntity, TrackingType} from "@/service/TrackingService";
import {formatToLabel} from "../utils/PeriodFormatter";
import UserProfileDialog from "@/components/UserProfileDialog.vue";
import MetricDialog from "@/components/MetricDialog.vue";

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
  setTimeout(toggleFullscreen, 400)
  track(new TrackData(TrackingEntity.PlayGame, TrackingType.Event, gameId()))
}

const route = useRoute();
const gameAlias = ref('');
const gameData = ref(null);
const isMarkedAsFavorite = ref(false);
const shouldShowPlayButton = ref();

const getDeveloperNames = (developers) => {
  if (developers) {
    const nameStrings = developers.map(item => `${item.name}`);
    return nameStrings.join(', ');
  }
}

onMounted(async () => {
  shouldShowPlayButton.value = window.innerWidth > 767;
  window.addEventListener('resize', handleResize);
  const isLoggedInUser = useAuthStore().isAuthenticated()
  gameAlias.value = route.params.alias;

  try {
    const response = await fetchGame(gameAlias.value);
    gameData.value = response;
    if (isLoggedInUser) {
      const favoriteGames = await fetchFavoriteGamesOfAuthUser(useAuthStore().getUserId)
      isMarkedAsFavorite.value = favoriteGames.some(favoriteGame => favoriteGame.game.id === gameId())
    } else {
      isMarkedAsFavorite.value = null
    }
  } catch (error) {
    console.error('Error al cargar el juego:', error);
  }
})

onBeforeUnmount(async () => {
  window.removeEventListener('resize', handleResize);
})

const handleRemoveGameFromFavorites = () => {
  if (isMarkedAsFavorite.value) {
    doRemoveGameFromFavorites(gameId())
    isMarkedAsFavorite.value = false
  }
}

function handleResize() {
  shouldShowPlayButton.value = window.innerWidth > 767;
}

/* Profile dialog */
const shouldShowProfileDialog = ref(false);
const selectedUserIdProfile = ref();
const handleShowProfile = (userId) => {
  selectedUserIdProfile.value = userId;
  shouldShowProfileDialog.value = true
}

const handleCloseProfile = () => {
  shouldShowProfileDialog.value = false
  selectedUserIdProfile.value = undefined
}

function gameId() {
  return gameData.value.id;
}

const showProfileDialogOfGameEditor = () => {
  selectedUserIdProfile.value = gameData.value.publisher.publisher_id;
  shouldShowProfileDialog.value = true
}
/* End profile dialog */


const handleAddGameToFavorites = () => {
  if (!isMarkedAsFavorite.value) {
    postAddGameToFavorite(gameId())
    isMarkedAsFavorite.value = true
  }
}

const handleFavorite = () => {
  isMarkedAsFavorite.value ? handleRemoveGameFromFavorites() : handleAddGameToFavorites()
}

const scrollToDownloadLinks = () => {
  document.getElementById('downloadLink').scrollIntoView({ behavior: 'smooth' });
}

const showMetricsDialog = ref(false)
const handleCloseMetrics = () => {
  showMetricsDialog.value = false
}

</script>

<template>
  <div v-if="!gameData" class="flex">
    <div class="card mb-5 m-auto mt-5 w-100 col-12 md:col-7 lg:col-7 p-4">
      <Skeleton class="mb-5" height="3rem" width="10rem"></Skeleton>
      <Skeleton height="500px" width="100%"></Skeleton>
      <Skeleton class="mb-5 mt-5" height="3rem" width="10rem"></Skeleton>
      <Skeleton class="mt-5" height="10rem" width="100%"></Skeleton>
    </div>
  </div>

  <div class="flex">
    <div class="card mb-5 m-auto mt-5 w-100 col-12 md:col-7 lg:col-7 p-4">
      <div class="flex align-items-center justify-content-between">
        <div class="flex flex-column mb-2">
          <h3 class="m-0">{{ gameData?.name }}</h3>
        </div>

        <div class="flex flex-row gap-2 align-items-center mb-2">
          <Button
              v-tooltip.left="'Ver métricas'"
              icon="pi pi-chart-bar"
              @click="showMetricsDialog = true"
          />
          <Button
              v-if="isMarkedAsFavorite != null"
              v-tooltip="!isMarkedAsFavorite ? 'Agregar a Favoritos' : 'Quitar de Favoritos'"
              :class="!isMarkedAsFavorite ? 'dislike-button' : ''"
              :icon="!isMarkedAsFavorite ? 'pi pi-heart' : 'pi pi-heart-fill'"
              rounded
              @click="handleFavorite"
          />
        </div>
      </div>
      <div v-if="gameData?.link_to_game">
        <div v-if="!isUserPlaying && shouldShowPlayButton" class='game-preview'>
          <button class='play-button' @click="executePlay">
            <span id='play-button-text'>Jugar</span>
            <i class="play-icon pi pi-play" style="color: #b3b3b3"></i>
          </button>
        </div>
        <div v-else-if="!isUserPlaying && !shouldShowPlayButton">
          <div class='game-preview '>
            <div class="no-available">
              No disponible para celulares
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class='game-preview '>
          <div class="download-message" @click="scrollToDownloadLinks">
            ¡Link de descarga debajo!
          </div>
        </div>
      </div>

      <div v-if="isUserPlaying" class="gameplay flex flex-column">
        <iframe ref="gameIframe" :src="gameData?.link_to_game" allowfullscreen="true" class="game"></iframe>
      </div>
      <div>
        <div class="font-medium text-2xl text-900 mb-3 mt-3">Galeria</div>
        <div class="carousel">
          <div v-for="(image, index) in gameData?.images" :key="index" class="carousel-item">
            <Image :key="index" :src="image.url" alt="Image" preview/>
          </div>
        </div>
      </div>
      <div>
        <div v-if="gameData?.link_to_download" class="mb-5">
          <div class="font-medium text-2xl text-900 mb-3 mt-3">Link de descarga</div>
          <a :href="gameData?.link_to_download" target="_blank" id="downloadLink">
            {{ gameData?.link_to_download }}
          </a>
        </div>
        <div class="font-medium text-2xl text-900 mb-3 mt-3">Información</div>
        <div class="text-500 mb-5">{{ gameData?.description }}</div>


        <ul class="list-none p-0 m-0">
          <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap gap-1">
            <div class="text-500 w-6 md:w-2 font-medium mr-3">Título</div>
            <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ gameData?.name }}</div>
          </li>
          <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap gap-1">
            <div class="text-500 w-6 md:w-2 font-medium mr-3">Géneros</div>
            <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
              <Chip v-for="(genre, index) in gameData?.genres" :key="index" :label="genre.spanish_name"
                    class="mr-2"></Chip>
            </div>
          </li>
          <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap gap-1">
            <div class="text-500 w-6 md:w-2 font-medium mr-3">Editor</div>
            <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
              <Chip :label="gameData?.publisher.username" class="mr-2 cursor-pointer" v-tooltip.rigth="'Ver perfil'" @click="showProfileDialogOfGameEditor"></Chip>
            </div>
          </li>
          <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap gap-1">
            <div class="text-500 w-6 md:w-2 font-medium mr-3">Equipo desarrollador</div>
            <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ gameData?.development_team }}</div>
          </li>
          <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap gap-1">
            <div class="text-500 w-6 md:w-2 font-medium mr-3">Desarrolladores</div>
            <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{
                getDeveloperNames(gameData?.developers)
              }}
            </div>
          </li>
          <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap gap-1">
            <div class="text-500 w-6 md:w-2 font-medium mr-3">Lanzamiento</div>
            <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ gameData?.release_date }}</div>
          </li>
          <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap gap-1" v-if="gameData?.period">
            <div class="text-500 w-6 md:w-2 font-medium mr-3">Cursada</div>
            <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1"> {{ formatToLabel(gameData?.period) }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <MetricDialog
      v-if="showMetricsDialog"
      :visible="showMetricsDialog"
      :gameId="gameId()"
      :close="handleCloseMetrics"
      :gameName="gameData?.name"
  />

  <GameCommentsCard v-if="gameData && gameData.id" :comments="gameData.comments ? gameData.comments : []"
                    :game-id="gameData.id" :game-publisher="gameData?.publisher.username" :handleShowProfileFn="(userId) => handleShowProfile(userId)"/>
  <p class="m-5 opacity-0">.</p>
  <UserProfileDialog
      v-if="selectedUserIdProfile"
      :visible="shouldShowProfileDialog"
      :editable="false"
      :userId="selectedUserIdProfile"
      :close="handleCloseProfile"
  />
</template>

<style>

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

.carousel {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.carousel-item {
  cursor: pointer;
  margin-right: 10px;
}

.carousel-item img {
  max-width: 150px;
}

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

.download-message {
  text-align: center;
  padding: 20px;
  position: relative;
  font-size: 24px;
  color: #9b2a3a;
}

.no-available {
  text-align: center;
  padding: 20px;
  position: relative;
  font-size: 24px;
  color: #9b2a3a;
}

.download-message:hover {
  cursor:pointer;
}

.download-message::after {
  content: "▼";
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
  display: block;
}
</style>