<script setup>

import {fetchBannerByAlias} from "@/service/BannersService";
import {onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';

const route = useRoute();
const bannerAlias = ref('');
const bannerData = ref(null);

onMounted(async () => {
  bannerAlias.value = route.params.alias;

  try {
    bannerData.value = await fetchBannerByAlias(bannerAlias.value);
    console.log(bannerData.value)
  } catch (error) {
    console.error('Error al cargar el banner:', error);
  }
})

</script>

<template>
  <div class="col-7 m-auto surface-section px-4 py-5 md:px-6 lg:px-8">
    <ul class="list-none p-0 m-0 flex align-items-center font-medium mb-3">
      <li>
        <router-link class="text-500 no-underline line-height-3 cursor-pointer" to="/">Home</router-link>
      </li>
      <li class="px-2">
        <i class="pi pi-angle-right text-500 line-height-3"></i>
      </li>
      <li>
        <span class="text-900 line-height-3">Banner</span>
      </li>
    </ul>
    <div class="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
      <div>
        <div class="font-medium text-3xl text-900">Banner</div>
      </div>
    </div>
  </div>

  <div v-if="!bannerData" class="flex">
    <div class="card mb-5 m-auto mt-5 w-100 col-12 md:col-7 lg:col-7 p-4">
      <Skeleton class="mb-5" height="3rem" width="10rem"></Skeleton>
      <Skeleton height="500px" width="100%"></Skeleton>
      <Skeleton class="mb-5 mt-5" height="3rem" width="10rem"></Skeleton>
      <Skeleton class="mt-5" height="10rem" width="100%"></Skeleton>
    </div>
  </div>
  <div class="flex">
    <div class="card mb-5 m-auto mt-5 w-100 col-12 md:col-7 lg:col-7 p-4">
      <div class="flex justify-content-center align-items-center banner-container">
        <Image :src="bannerData?.picture.byte_array_as_string" class="banner-image" alt="Image" ></Image>
      </div>

      <h3>{{ bannerData?.title }}</h3>
      <div class="w-full" v-html="bannerData?.rich_text"></div>
    </div>
  </div>
  <p class="m-5 opacity-0">.</p>
</template>

<style>

.ql-align-center {
  text-align: center
}

.ql-align-right {
  text-align: end;
}

.ql-align-left {
  text-align: start;
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

.banner-image {
  height: auto;
}

.banner-container {
  overflow: hidden;
}

</style>