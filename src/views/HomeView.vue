<script setup>

import {computed, onMounted, ref} from 'vue'
import {fetchData} from "@/service/GamesService"
import {useRouter} from 'vue-router';
import RankIconsFactory from '@/services/RankIconsFactory'
import {fetchActiveBanners} from "@/service/BannersService";

const filterKey = ref('');
const isLoadingData = ref(true);
const games = ref([]);
const error = ref([]);
const router = useRouter();

const images = ref();

onMounted(async () => {
  await fetchActiveBanners().then((data) => (images.value = data));
  console.log(images.value)
      try {
        const result = await fetchData();
        result.forEach(game => game.rankBadgeSrc = RankIconsFactory.getRankIcon(game.rank_badge))
        games.value = result;
        isLoadingData.value = false
      } catch (err) {
        error.value = err;
      }
    });

const filteredData = computed(() => {
  const lowerCaseFilter = filterKey.value.toLowerCase()
  return games.value.filter(
    (item) =>
      item.name.toLowerCase().includes(lowerCaseFilter) ||
      item.description.toLowerCase().includes(lowerCaseFilter)
  )
})

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
      <div class="mb-5 m-auto mt-5 w-100 col-12 md:col-10 lg:col-9 p-4  justify-content-center text-center align-items-center align-content-center">
        <Galleria
            :autoPlay="true"
            :autoPlayInterval="10000"
            :effect="'fade'"
            :numScroll="1"
            :showThumbnails="false"
            :value="images"
            circular
            class="m-auto"
            :numVisible="5"
        >
        <template #item="slotProps">
          <div class="overflow-auto">
            <Image :alt="slotProps.item.alias" :src="slotProps.item.picture.byte_array_as_string" class="m-auto" style="width: 100%; display: block; cursor: pointer;" @click="goToBanner(slotProps.item)" />
          </div>

        </template>
        <template #caption="slotProps">
          <div class="text-xl mb-2 font-bold">{{ slotProps.item.title }}</div>
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
              <div class="col-6 mt-3 col-offset-3">
                <InputText v-model="filterKey" placeholder="Search" />
              </div>
              <div v-if="!layout === 'grid'" class="col-offset-2 col-1">
                <DataViewLayoutOptions v-model="layout" />
              </div>
            </div>
            <div v-if="isLoadingData" class="h-5rem mt-8">
            <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
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
                  <div class="mb-3">{{ slotProps.data.description }}</div>
                  <div class="card-link">
                    <button class="button-50" type="button" @click="goToGame(slotProps.data.alias)">Go to game</button>
                  </div>
                </div>
              </div>
            </div>
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
