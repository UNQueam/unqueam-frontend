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

  <div class="card col-9 m-auto my-5 p-6 ">
    <form @submit.prevent="publishGame">
      <label class="block text-600 font-medium mb-2" for="name">Título del juego</label>
      <InputText id="name" v-model="game.name" class="md:w-25rem w-full mb-5" placeholder="El título del juego" style="padding: 1rem" type="text" />

      <label class="block text-600 font-medium mb-2" for="description">Descripción</label>
      <Textarea id="description" v-model="game.description" class="w-full mb-5" placeholder="El título del juego" style="padding: 1rem" type="text" />

      <label class="block text-600 font-medium mb-2" for="game">Link al github pages</label>
      <InputText id="game" v-model="game.link_to_game" class="w-full mb-5" placeholder="El enlace al deploy en github pages" style="padding: 1rem" type="text" />

      <label class="block text-600 font-medium mb-2" for="devTeam">Equipo desarrollador</label>
      <InputText id="devTeam" v-model="game.development_team" class="w-full mb-5" placeholder="El nombre del equipo desarrollador" style="padding: 1rem" type="text" />

      <label class="block text-600 font-medium mb-2" for="release">Fecha de lanzamiento</label>
      <Calendar id="release" v-model="game.release_date" :maxDate="maxReleaseDate" class="w-full mb-5 input-height" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" showButtonBar showIcon/>

      <label class="block text-600 font-medium mb-2 " for="genres">Géneros</label>
      <MultiSelect id="genres" v-model="game.genres" :maxSelectedLabels="10" :options="genres" class="w-full md:w-25rem input-height align-items-center" display="chip" filter
                     optionLabel="name" placeholder="Seleccionar géneros" />

      <label class="block text-600 font-medium mb-2 mt-5" for="devs">Desarrolladores</label>
      <div class="p-fluid">
        <Chips id="devs" v-model="game.developers" separator="," class="input-height" placeholder="">
          <template #chip="slotProps">
            <div>
              <span>{{ slotProps.value }}</span>
            </div>
          </template>
        </Chips>
      </div>
      <small id="username-help">Ingresa los nombres de los desarrolladores separando con 'coma' o 'ENTER'.</small>

      <label class="block text-600 font-medium mb-2 mt-5" for="logo">Logo de videojuego</label>
      <!-- <FileUpload :auto="true" :chooseLabel="'Seleccionar logo'" accept="image/*" class="mb-5" customUpload mode="basic" name="demo[]" url="/api/upload" @uploader="uploadGameLogo" /> -->
       <div class="flex gap-5">
         <InputText id="logo" v-model="logoField" class="w-full input-height" placeholder="URL de la imagen" style="padding: 1rem" type="text" />
         <Button class="input-height" type="button" @click="loadLogoImage">Seleccionar Logo</Button>
       </div>
      <small class="mb-5" id="logo-help">Resolucion recomendada: 1024x1024.</small>
         <div v-if="game.logo_url" class="flip-card m-auto mb-5">
           <div class="face front">
             <img
                 :src="game.logo_url"
                 class="shadow-2 my-1 mx-0 preview-image"
             />
             <h3 class="text-center">{{ game.name }}</h3>
           </div>
         </div>
        <label class="block text-600 font-medium mt-5 mb-2" for="images">Imágenes</label>
        <GameImageManager id="images" v-model:images="game.images" class="mb-5" @remove-image="handleRemoveImage" @add-image="handleAddImage"/>
        <div class="flex flex-row justify-content-end">
          <Button :loading="false" class="input-height" label="Publicar videojuego" type="submit"></Button>
        </div>

      </form>
    </div>
    <Toast position="top-right"/>
  </template>

  <script setup>
  import {computed, onBeforeMount, ref} from "vue";
  import {fetchGenres} from "@/service/GenresService";
  import GameImageManager from "@/components/GameImageManager.vue";
  import {useRoute, useRouter} from "vue-router";
  import {fetchGame} from "@/service/GamesService";

  // Handle edition --------------------------------------
  const router = useRouter();
  const route = useRoute();
  const gameId = computed(() => route.params.id);

  const isEditMode = computed(() => !!gameId.value);
  //------------------------------------------------------

  const game = ref({
    name: "",
    link_to_game: "",
    description: "",
    development_team: "",
    release_date: null,
    genres: [],
    developers: null,
    images: [],
    logo_url: ""
  })

  const genres = ref([])
  const maxReleaseDate = ref(new Date());
  const logoField = ref("")

  const loadLogoImage = () => {
    game.value.logo_url = logoField.value
  }

  const publishGame = () => {
    if (isEditMode.value) {
      //await updateGame(gameId.value, game.value);
      console.log(game)
      console.log("Game updated");
    } else {
      //await createGame(game.value);
      console.log("Game created");
    }
  }

  onBeforeMount(async () => {
    try {
      genres.value = await fetchGenres();
      genres.value = genres.value.map(item => ({
        ...item,
        name: item.spanish_name
      }));
      if (isEditMode.value) {
        //TIRAR UN ACCESS DENIED SI CORRESPONDE.
        const existingGame = await fetchGame(gameId.value);
        game.value = {...game.value, ...existingGame};
        game.value.genres = game.value.genres.map(item => ({
          ...item,
          name: item.spanish_name
        }));
        console.log(game.value)
      }
    } catch (err) {
      //do nothing
    }
  });

  const handleRemoveImage = (imageToBeRemoved) => {
    game.value.images = game.value.images.filter(savedImage => savedImage.id !== imageToBeRemoved.id);
  };
  const handleAddImage = (newImage) => {
    game.value.images.push(newImage);
  };


  /*
  IDEA PARA IMAGENES A FUTURO.
  - Sobre imagenes:
  falta validar que sean de una extension imagen el file que carga el user (jpg, png, etc)
  comprobar los sizes que no sean muy pesados
  lo mismo la resolucion, que no sea tan grande

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

   */

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

  .input-height {
    height: 50px;
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
  }

  .flip-card .front {
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
    text-align: center;
  }

  .preview-image {
    max-width: 350px; /* Ancho máximo */
    max-height: 392px; /* Alto máximo */
  }
  </style>






