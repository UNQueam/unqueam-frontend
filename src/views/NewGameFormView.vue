<template>
  <div class="col-9 m-auto surface-section px-4 py-5 md:px-6 lg:px-8">
    <ul class="list-none p-0 m-0 flex align-items-center font-medium mb-3">
      <li>
        <router-link class="text-500 no-underline line-height-3 cursor-pointer" to="/">Home</router-link>
      </li>
      <li class="px-2">
        <i class="pi pi-angle-right text-500 line-height-3"></i>
      </li>
      <li>
        <router-link class="text-500 no-underline line-height-3 cursor-pointer" to="/dev/games">Mis juegos</router-link>
      </li>
      <li class="px-2">
        <i class="pi pi-angle-right text-500 line-height-3"></i>
      </li>
      <li>
        <span class="text-900 line-height-3">Publicar</span>
      </li>
    </ul>
    <div class="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
      <div>
        <div class="font-medium text-3xl text-900">Publicar</div>
      </div>
    </div>
  </div>

  <div class="card col-9 m-auto my-5 p-6">
    <form onsubmit="publishGame">
      <label class="block text-600 font-medium mb-2" for="email1">Título del juego</label>
      <InputText id="email1" v-model="username" class="w-25rem mb-5" placeholder="El título del juego" style="padding: 1rem" type="text" />


    <label class="block text-600 font-medium mb-2" for="email1">Descripción</label>
    <Textarea id="email1" v-model="username" class="w-full mb-5" placeholder="El título del juego" style="padding: 1rem" type="text" />

    <hr class="my-2">

    <label class="block text-600 font-medium mb-2" for="email1">Equipo desarrollador</label>
    <InputText id="email1" v-model="username" class="w-full mb-5" placeholder="El nombre del equipo desarrollador" style="padding: 1rem" type="text" />

    <label class="block text-600 font-medium mb-2" for="email1">Fecha de lanzamiento</label>
    <Calendar v-model="selectedReleaseDate" :maxDate="maxReleaseDate" class="w-full mb-5" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" showButtonBar showIcon/>

    <label class="block text-600 font-medium mb-2" for="email1">Géneros</label>
    <MultiSelect v-model="selectedGenres" :maxSelectedLabels="10" :options="genres" class="w-full md:w-25rem mb-5" display="chip" filter
                   optionLabel="name" placeholder="Seleccionar géneros" />

    <label class="block text-600 font-medium mb-2 mt-5" for="email1">Desarrolladores</label>
    <div class="p-fluid">
      <Chips v-model="selectedDevelopers" separator=",">
        <template #chip="slotProps">
          <div>
            <span>{{ slotProps.value }}</span>
          </div>
        </template>
      </Chips>
    </div>
    <small id="username-help">Ingresa los nombres de los desarrolladores separando con 'coma' o 'ENTER'.</small>

    <hr class="my-2">
    <label class="block text-600 font-medium mb-2" for="email1">Logo de videojuego</label>
    <FileUpload :auto="true" :chooseLabel="'Seleccionar logo'" accept="image/*" class="mb-5" customUpload mode="basic" name="demo[]" url="/api/upload" @uploader="uploadGameLogo" />

    <label class="block text-600 font-medium mb-2" for="email1">Imágenes</label>
    <GameImagesUploader></GameImagesUploader>
    <input v-model="imageUrl" placeholder="URL de la imagen" />
    <button type="button" @click="loadImageDimensions">Obtener resolución</button>
    <p v-if="imageWidth !== null && imageHeight !== null">
      Resolución de la imagen: {{ imageWidth }}x{{ imageHeight }}
    </p>
    <div class="w-full">
      <Galleria :value="images" :responsiveOptions="galleryResponsiveOptions" :numVisible="5" containerStyle="max-width: 640px; margin: auto"
                 :showThumbnails="false" :showItemNavigatorsOnHover="true" :showIndicators="true" :circular="true"
                 :changeItemOnIndicatorHover="true" :key="galleryRefreshKey">
        <template #item="slotProps" >
          <div class="image-container">
            <img :src="slotProps.item?.itemImageSrc" :alt="slotProps.item?.alt" class="game-image" />
            <button class="delete-button" @click="removeImage(slotProps.item)" type="button">
              <i class="pi pi-trash" style="color: white; font-size: 24px;"></i>
            </button>
          </div>
        </template>
      </Galleria>
    </div>
      <Button :loading="false" class="p-2 mt-3" label="Publicar videojuego" style="float: right;" type="submit"></Button>
    </form>
  </div>
  <Toast position="top-right"/>
</template>

<script setup>
import {onBeforeMount, ref} from "vue";
import {fetchGenres} from "@/service/GenresService";
import GameImagesUploader from "@/components/GameImagesUploader.vue";
import Galleria from 'primevue/galleria';

const selectedReleaseDate = ref();
const selectedGenres = ref([]);
const selectedDevelopers = ref();

const genres = ref([])

const maxReleaseDate = ref(new Date());

//IMAGENES.
//***************************************************************
const images = ref([]);
const galleryRefreshKey = ref(0);
const galleryResponsiveOptions = ref([
  {
    breakpoint: '991px',
    numVisible: 4
  },
  {
    breakpoint: '767px',
    numVisible: 3
  },
  {
    breakpoint: '575px',
    numVisible: 1
  }
]);


const imageUrl = ref("");
const nextImgId = ref(0)
const imageWidth = ref(null);
const imageHeight = ref(null);

const loadImageDimensions = () => {
  //ACA HAY QUE VER EL TEMA VALIDACIONES. Deje sentadas las bases para poder acceder al height y width y los imprimo abajo del input.
  if (imageUrl.value) {
    const img = new Image();
    img.src = imageUrl.value;

    img.onload = () => {
      imageWidth.value = img.width;
      imageHeight.value = img.height;
    };
    images.value.push(
        {
          id: nextImgId.value,
          itemImageSrc: imageUrl.value
        });
    nextImgId.value = nextImgId.value + 1
  }
};

const removeImage = (imageToBeRemoved) => {
  images.value = images.value.filter(savedImage => savedImage.id !== imageToBeRemoved.id);
  galleryRefreshKey.value++; //Se usa esta key para refrescar el component gallery asi se ven reflejados los cambios.
};


//***************************************************************




/*
TODO:
- Sobre imagenes:
falta validar que sean de una extension imagen el file que carga el user (jpg, png, etc)
comprobar los sizes que no sean muy pesados
lo mismo la resolucion, que no sea tan grande
 */
const uploadGameLogo = async (event) => {
  const file = event.files[0];
  console.log(file)
  console.log(event.files)
  const reader = new FileReader();
  let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url

  reader.readAsDataURL(blob);

  reader.onloadend = function () {
    const base64data = reader.result;
  };
};

const customBase64Uploader = async (event) => {
  const file = event.files[0];
  console.log(file)
  console.log(event.files)
  const reader = new FileReader();
  let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url

  reader.readAsDataURL(blob);

  reader.onloadend = function () {
    const base64data = reader.result;
  };
};

const publishGame = () => {
  console.log("publish")
}

onBeforeMount(async () => {
  try {
    genres.value = await fetchGenres();
    genres.value = genres.value.map(item => ({
      ...item,
      name: item.spanish_name
    }));
  } catch (err) {
    //do nothing
  }
});

</script>

<style>
.image-container {
  position: relative;
}

.game-image {
  width: 100%;
  max-height: 500px;
  display: block;
}

.delete-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #9b2a3a;
  border: 2px solid #9b2a3a;
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  transition: transform 0.2s;
}

.delete-button:hover {
  transform: scale(1.1);
}
</style>






