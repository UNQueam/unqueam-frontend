<script setup>

import {computed, onMounted, ref} from 'vue'
import {fetchData} from "@/service/GamesService"
import {useRouter} from 'vue-router';
import RankIconsFactory from '@/services/RankIconsFactory'
import {fetchActiveBanners} from "@/service/BannersService";
import OverlayPanel from "primevue/overlaypanel";
import {formatToFilterLabel} from "@/utils/PeriodFormatter";

const filterKey = ref('');
const isLoadingData = ref(true);
const games = ref([]);
const error = ref([]);
const router = useRouter();
const gameYears = ref(["No especificado"]);
const selectedYears = ref([]);
const semesters = ref(["Primer cuatrimestre", "Segundo cuatrimestre", "No especificado"]);
const selectedSemesters = ref([]);
const selectedGenres = ref([]);
const availableGenres = ref();
const filterPanel = ref();

const images = ref();

onMounted(async () => {
  const gamesGenres = [];
  const genreSet = new Set();

  await fetchActiveBanners().then((data) => (images.value = data));
      try {
        const result = await fetchData();
        result.forEach(game => {
              game.rankBadgeSrc = RankIconsFactory.getRankIcon(game.rank_badge);
              if (game.period) {
                gameYears.value.push(game.period.year);
              }

          game.genres.forEach(genre => {
            const spanishName = genre.spanish_name;
            if (!genreSet.has(spanishName)) {
              gamesGenres.push(spanishName);
              genreSet.add(spanishName);
            }
          })
        })
        gameYears.value = Array.from(new Set(gameYears.value)).sort();
        games.value = result;
        isLoadingData.value = false
      } catch (err) {
        error.value = err;
      }

    availableGenres.value = gamesGenres;
});

const filteredData = computed(() => {
  const lowerCaseFilter = filterKey.value.toLowerCase()
  return games.value.filter(
    (item) =>
        (item.name.toLowerCase().includes(lowerCaseFilter) ||
        item.description.toLowerCase().includes(lowerCaseFilter)) &&
        correspondsToSelectedYears(item) &&
        correspondsToSelectedGenres(item) &&
        correspondsToSelectedSemester(item)
  )
})

const correspondsToSelectedGenres = (game) => {
  if (selectedGenres.value.length !== 0) {
    return game.genres.some(genre => {
      return selectedGenres.value.includes(genre.spanish_name);
    })
  }
  return true;
}

const correspondsToSelectedYears = (game) => {
  if (game.period && selectedYears.value.length !== 0) {
    return selectedYears.value.includes(game.period.year);
  }
  return selectedYears.value.length === 0 || (!game.period && selectedYears.value.includes("No especificado"));
}

const correspondsToSelectedSemester = (game) => {
  if (game.period && selectedSemesters.value.length !== 0) {
    return selectedSemesters.value.includes(formatToFilterLabel(game.period));
  }
  return selectedSemesters.value.length === 0 || (!game.period && selectedSemesters.value.includes("No especificado"));
}

const removeSelectedSemester = (semester) => {
  selectedSemesters.value = selectedSemesters.value.filter(aSemester => aSemester !== semester)
}

const removeSelectedGenre = (genre) => {
  selectedGenres.value = selectedGenres.value.filter(aGenre => aGenre !== genre)
}

const removeSelectedYear = (year) => {
  selectedYears.value = selectedYears.value.filter(aYear => aYear !== year)
}

const toggleFilters = (event) => {
  filterPanel.value.toggle(event);
}

const goToGame = (gameAlias) => {
  router.push({ name: 'GameDetails', params: { alias: gameAlias } });
};

const goToBanner = (banner) => {
  router.push({ name: 'SingleBanner', params: {alias: banner.alias}})
}

const layout = ref('grid')

</script>

<template>

    <div class="flex">
      <div class="m-auto mt-5 w-100 col-12 md:col-10 lg:col-9 p-4  justify-content-center text-center align-items-center align-content-center">
        <Galleria
            :autoPlay="true"
            :autoPlayInterval="10000"
            :effect="'fade'"
            :numScroll="1"
            :showThumbnails="false"
            :show-indicators="true"
            :value="images"
            circular
            class="m-auto"
            :numVisible="5"
        >
        <template #item="slotProps">
          <div class="card p-0 m-0 overflow-auto">
            <Image :alt="slotProps.item.alias" :src="slotProps.item.picture.byte_array_as_string" class="m-auto" style="border-radius: 20px; width: 100%; display: block; cursor: pointer;" @click="goToBanner(slotProps.item)" />
          </div>

        </template>
      </Galleria>
      </div>
    </div>

  <div class="flex">
    <div class="card mb-5 m-auto mt-5 w-100 col-12 md:col-10 lg:col-9 p-4">
        <div class="title">
          <h5>Juegos</h5>
        </div>
        <DataView :value="filteredData" :layout="layout" :paginator="true" :rows="9">
          <template #header>
            <div class="grid grid-nogutter">
              <div class="mt-3 col-offset-3 col-9 md:col-6 flex m-auto">
                <InputText v-model="filterKey" placeholder="Buscar..." />
                <Button class="ml-2" icon="pi pi-filter-fill" @click="toggleFilters"></Button>
                <OverlayPanel ref="filterPanel">
                  <div>
                    <div class="mb-1">Año de cursada</div>
                    <MultiSelect v-model="selectedYears" :options="gameYears"  placeholder="Años"
                                 class="w-full md:w-20rem" />

                    <div class="mb-1 mt-3">Cuatrimestre de la cursada</div>
                    <MultiSelect v-model="selectedSemesters" :options="semesters"  placeholder="Cuatrimestre"
                                 class="w-full md:w-20rem" />

                    <div class="mb-1 mt-3">Géneros</div>
                    <MultiSelect v-model="selectedGenres" :options="availableGenres"  placeholder="Géneros"
                                 class="w-full md:w-20rem" />
                  </div>
                </OverlayPanel>
              </div>
              <div v-if="!layout === 'grid'" class="col-offset-2 col-1">
                <DataViewLayoutOptions v-model="layout" />
              </div>
            </div>
            <div v-if="isLoadingData" class="h-5rem mt-8">
            <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
            </div>
            <div v-if="selectedYears.length > 0 || selectedSemesters.length > 0 || selectedGenres.length > 0" class="font-normal" style="font-size: 12px">
              <p class="m-0 p-0 font-bold">
                Filtros aplicados
              </p>
              <div v-if="selectedYears.length > 0" class="flex flex-row gap-1 mt-2 align-items-center">
                <p class="m-0">
                  <i class="pi pi-angle-right"/>
                  Años:
                </p>
                  <Chip v-for="year of selectedYears" v-bind:key="year" style="font-size: 12px; padding: 2px 5px" removable @remove="removeSelectedYear(year)">{{ year }}</Chip>
              </div>
              <div v-if="selectedSemesters.length > 0" class="flex flex-row gap-1 mt-2 align-items-center">
                <p class="m-0">
                  <i class="pi pi-angle-right"/>
                  Cuatrimestres:
                </p>
                <Chip v-for="semester of selectedSemesters" v-bind:key="semester" style="font-size: 12px; padding: 2px 5px" removable @remove="removeSelectedSemester(semester)">{{ semester }}</Chip>
              </div>
              <div v-if="selectedGenres.length > 0" class="flex flex-row gap-1 mt-2 align-items-center">
                <p class="m-0">
                  <i class="pi pi-angle-right"/>
                  Géneros:
                </p>
                <Chip v-for="genre of selectedGenres" v-bind:key="genre" style="font-size: 12px; padding: 2px 5px" removable @remove="removeSelectedGenre(genre)">{{ genre }}</Chip>
              </div>
            </div>
          </template>

          <template #grid="slotProps">
            <div class="col-12 md:col-6 lg:col-4">
              <div class="flip-card">
                <div class="face front">
                  <img
                    :src="slotProps.data.logo_url"
                    class="shadow-2 my-1 mx-0"
                  />
                  <Avatar v-if="slotProps.data.rankBadgeSrc" :image="slotProps.data.rankBadgeSrc" class="p-overlay-badge absolute right-0 m-1" size="large"/>
                  <h3 class="text-center">{{ slotProps.data.name }}</h3>
                </div>

                <div class="face back">
                  <h3>{{ slotProps.data.name }}</h3>
                  <div class="mb-3">
                    <p class="text-sm">{{ slotProps.data.description }}</p>
                  </div>
                  <div class="card-link">
                    <button class="button-50" type="button" @click="goToGame(slotProps.data.alias)">Go to game</button>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template #empty >
            <div  class="no-games mb-5 mt-5"> No se encontraron juegos. </div>
          </template>
        </DataView>
    </div>
  </div>
</template>

<style scoped>
.title {
  text-align: center;
}

.grid-nogutter > .col,
.grid-nogutter > [class*='col-'] {
  padding: 0;
  justify-content: center;
  display: flex;
  margin-top: 0px !important;
  align-content: center;
  align-items: center;
}

.no-games {
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 18px;
  transition: color 0.3s;
}

.flip-card {
  position: relative;
  width: 25rem;
  height: 28rem;
  margin: 10px;
}

.flip-card .face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
  overflow: hidden;
  transition: 0.5s;
}

.flip-card .front {
  transform: perspective(600px) rotateY(0deg);
  box-shadow: 0 5px 10px #000;
}

.flip-card .front img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.flip-card .front h3 {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 45px;
  line-height: 45px;
  color: #fff;
  background: rgba(0, 0, 0, 0.4);
  text-align: center();
}

.flip-card .back {
  transform: perspective(600px) rotateY(180deg);
  background: #9b2a3a;
  padding: 15px;
  color: #f3f3f3;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  box-shadow: 0 5px 10px #000;
}

.flip-card .back .card-link {
  height: 50px;
  line-height: 50px;
}

.flip-card .back .card-link a {
  color: #f3f3f3;
}

.flip-card .back h3 {
  font-size: 30px;
  margin-top: 20px;
  letter-spacing: 2px;
}

.flip-card .back p {
  letter-spacing: 1px;
}

.flip-card:hover .front {
  transform: perspective(600px) rotateY(180deg);
}

.flip-card:hover .back {
  transform: perspective(600px) rotateY(360deg);
}

.button-50 {
  appearance: button;
  background-color: #000;
  background-image: none;
  border: 1px solid #000;
  border-radius: 4px;
  box-shadow:
    #fff 4px 4px 0 0,
    #000 4px 4px 0 1px;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-family: ITCAvantGardeStd-Bk, Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  margin: 0 5px 10px 0;
  overflow: visible;
  padding: 12px 40px;
  text-align: center;
  text-transform: none;
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
  vertical-align: middle;
  white-space: nowrap;
}

.button-50:focus {
  text-decoration: none;
}

.button-50:hover {
  text-decoration: none;
}

.button-50:active {
  box-shadow: rgba(0, 0, 0, 0.125) 0 3px 5px inset;
  outline: 0;
}

.button-50:not([disabled]):active {
  box-shadow:
    #fff 2px 2px 0 0,
    #000 2px 2px 0 1px;
  transform: translate(2px, 2px);
}

@media (min-width: 768px) {
  .button-50 {
    padding: 12px 50px;
  }
}
</style>
