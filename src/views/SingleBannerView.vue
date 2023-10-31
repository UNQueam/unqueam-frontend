<script setup>

import {fetchBannerByAlias} from "@/service/BannersService";
import {onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';

const route = useRoute();
const bannerAlias = ref('');
const bannerData = ref(null);
const bannerIsDeactivated = ref(false);
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  bannerAlias.value = route.params.alias;

  try {
    bannerData.value = await fetchBannerByAlias(bannerAlias.value);
    bannerIsDeactivated.value = bannerData.value == null
  } catch (error) {
    console.error('Error al cargar el banner:', error);
  }
  isLoading.value = false
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

  <div v-if="isLoading" class="flex">
    <div class="card mb-5 m-auto mt-5 w-100 col-12 md:col-7 lg:col-7 p-4">
      <Skeleton class="mt-5 mb-5" height="13rem" width="100%"></Skeleton>
      <Skeleton class="mb-5" height="3rem" width="10rem"></Skeleton>
      <Skeleton height="400px" width="100%"></Skeleton>
    </div>
  </div>

  <div v-if="bannerIsDeactivated" class="flex flex-column align-items-center justify-content-center m-auto">
    <div class="flex flex-column align-items-center justify-content-center mt-8">
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style="border-radius: 53px">
          <div class="grid flex flex-column align-items-center">
            <div class="flex justify-content-center align-items-center border-circle" style="width: 3.2rem; height: 3.2rem; background-color: #964849;">
              <i class="text-50 pi pi-fw pi-ban text-2xl text-white"></i>
            </div>
            <h1 class="text-900 font-bold text-4xl lg:text-5xl mb-2">Banner desactivado</h1>
            <span class="text-600 ">El banner se encuentra desactivado por un administrador.</span>
            <span class="text-600 mb-5">No es público en este momento.</span>
            <div class="col-12 mt-5 text-center">
              <i class="pi pi-fw pi-arrow-left text-blue-500 mr-2" style="vertical-align: center"></i>
              <router-link class="text-blue-500" to="/">Ir al Inicio</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="bannerData && !bannerIsDeactivated" class="flex">
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

.banner-image {
  height: auto;
}

.banner-container {
  overflow: hidden;
}

</style>