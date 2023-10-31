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
        <span class="text-900 line-height-3">{{ isEditMode ? 'Editar' : 'Publicar' }}</span>
      </li>
    </ul>
    <div class="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
      <div>
        <div class="font-medium text-3xl text-900">{{ isEditMode ? 'Editar' : 'Publicar' }}</div>
      </div>
    </div>
  </div>

  <div class="card col-9 m-auto my-5 p-6 ">
    <form @submit.prevent="publishGame">
      <label class="block text-600 font-medium mb-2" for="name">Título del juego</label>
      <InputText id="name" v-model="game.name" class="md:w-25rem w-full" placeholder="El título del juego" style="padding: 1rem" type="text" />

      <div class="error-container">
        <small v-for="error of v$.name.$errors" :key="error.$uid" class="p-error">{{ getCustomError("name", error.$validator, error) + ". " }}</small>
      </div>

      <label class="block text-600 font-medium mb-2 mt-5" for="alias">Alias del juego</label>
      <div class="flex flex-column">
        <InputText id="alias" v-model="game.alias" class="md:w-25rem w-full" placeholder="Alias del juego" style="padding: 1rem" type="text" />
        <small v-if="game.alias" class="mt-1" id="alias-help">Se verá asi en la url: <span style="color:#9b2a3a"> {{toKebabCase(game.alias)}} </span> </small>
      </div>


      <div class="error-container">
        <small v-for="error of v$.alias.$errors" :key="error.$uid" class="p-error">{{ getCustomError("alias", error.$validator, error) + ". " }}</small>
      </div>

      <label class="block text-600 font-medium mb-2 mt-5" for="description">Descripción</label>
      <Textarea id="description" v-model="game.description" class="w-full" placeholder="El título del juego" style="padding: 1rem" type="text" />

      <div class="error-container">
        <small v-for="error of v$.description.$errors" :key="error.$uid" class="p-error">{{ getCustomError("description", error.$validator, error) + ". " }}</small>
      </div>

      <label class="block text-600 font-medium mb-2 mt-5" for="game">Link al github pages</label>
      <InputText id="game" v-model="game.link_to_game" class="w-full" placeholder="El enlace al deploy en github pages" style="padding: 1rem" type="text" />

      <div class="error-container">
        <small v-for="error of v$.link_to_game.$errors" :key="error.$uid" class="p-error">{{ getCustomError("link_to_game", error.$validator, error) + ". " }}</small>
      </div>

      <label class="block text-600 font-medium mb-2 mt-5" for="game">Link de descarga</label>
      <InputText id="game" v-model="game.link_to_download" class="w-full" placeholder="El enlace de descarga del videojuego" style="padding: 1rem" type="text" />

      <div class="error-container">
        <small v-for="error of v$.link_to_download.$errors" :key="error.$uid" class="p-error">{{ getCustomError("link_to_download", error.$validator, error) + ". " }}</small>
      </div>

      <label class="block text-600 font-medium mb-2 mt-5" for="devTeam">Equipo desarrollador</label>
      <InputText id="devTeam" v-model="game.development_team" class="w-full " placeholder="El nombre del equipo desarrollador" style="padding: 1rem" type="text" />

      <div class="error-container">
        <small v-for="error of v$.development_team.$errors" :key="error.$uid" class="p-error">{{ getCustomError("development_team", error.$validator, error) + ". " }}</small>
      </div>

      <label class="block text-600 font-medium mb-2 mt-5" for="release">Fecha de lanzamiento</label>
      <Calendar id="release" v-model="game.release_date" :maxDate="maxReleaseDate" class="w-full input-height" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" showButtonBar showIcon/>

      <div class="error-container">
        <small v-for="error of v$.release_date.$errors" :key="error.$uid" class="p-error">{{ getCustomError("release_date", error.$validator, error) + ". " }}</small>
      </div>

      <label class="block text-600 font-medium mb-2 mt-5" for="genres">Géneros</label>
      <MultiSelect id="genres" v-model="game.genres" :maxSelectedLabels="10" :options="genres" class="w-full md:w-25rem input-height align-items-center" display="chip" filter
                     optionLabel="name" placeholder="Seleccionar géneros" />

      <div class="error-container">
        <small v-for="error of v$.genres.$errors" :key="error.$uid" class="p-error">{{ getCustomError("genres", error.$validator, error) + ". " }}</small>
      </div>

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
      <small id="devs-help">Ingresa los nombres de los desarrolladores separando con 'coma' o 'ENTER'.</small>

      <div class="error-container">
        <small v-for="error of v$.developers.$errors" :key="error.$uid" class="p-error">{{ getCustomError("developers", error.$validator, error) + ". " }}</small>
      </div>

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

      <div class="error-container">
        <small v-for="error of v$.logo_url.$errors" :key="error.$uid" class="p-error">{{ getCustomError("logo_url", error.$validator, error) + ". " }}</small>
      </div>

        <label class="block text-600 font-medium mt-5 mb-2" for="images">Imágenes</label>
        <GameImageManager id="images" v-model:images="game.images"  @remove-image="handleRemoveImage" @add-image="handleAddImage"/>
      <div class="error-container">
        <small v-for="error of v$.images.$errors" :key="error.$uid" class="p-error">{{ getCustomError("images", error.$validator, error) + ". " }}</small>
      </div>
        <div class="flex flex-row justify-content-end mt-5 gap-3">
          <Button :loading="false" class="input-height w-8rem cancel-button" label="Cancelar" type="button" @click="router.back()"></Button>
          <Button :label="isEditMode ? 'Editar' : 'Publicar'" :loading="false" class="input-height w-8rem" type="submit"></Button>
        </div>
      </form>
    </div>
  <hr class="mb-5">
    <Toast position="top-right"/>
  </template>

  <script setup>
  import {computed, onBeforeMount, ref} from "vue";
  import {fetchGenres} from "@/service/GenresService";
  import GameImageManager from "@/components/GameImageManager.vue";
  import {useRoute, useRouter} from "vue-router";
  import {createGame, editGame, fetchGame} from "@/service/GamesService";
  import {useVuelidate} from "@vuelidate/core";
  import AuthenticationService from "@/service/AuthenticationService";
  import {useAuthStore} from "@/stores/authStore";
  import {helpers, required, requiredUnless, url} from "@vuelidate/validators";
  import {formatGameDate} from "@/utils/DateFormatter";
  import {getCustomError} from "@/utils/FormErrorMessageHandler";
  import {useToast} from "primevue/usetoast";
  import {toKebabCase} from "@/utils/stringFormatter";

  const toast = useToast();

  // Handle edition --------------------------------------
  const router = useRouter();
  const route = useRoute();
  const gameAlias = computed(() => route.params.alias);

  const isEditMode = computed(() => !!gameAlias.value);
  const authService = new AuthenticationService();
  const authStore = useAuthStore();
  //------------------------------------------------------

  const game = ref({
    name: "",
    alias: "",
    link_to_game: "",
    link_to_download: "",
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

  onBeforeMount(async () => {
    try {
      genres.value = await fetchGenres();
      genres.value = genres.value.map(item => ({
        ...item,
        name: item.spanish_name
      }));
      if (isEditMode.value) {
        const existingGame = await fetchGame(gameAlias.value);
        if(existingGame.publisher.username !== authStore.getUsername) {
          await router.push("/access-denied")
        }
        game.value = {...game.value, ...existingGame};
        game.value.genres = game.value.genres.map(item => ({
          ...item,
          name: item.spanish_name
        }));
        game.value.developers = game.value.developers.map(developer => developer.name);
      }
    } catch (err) {
      //do nothing
    }
  });

  const handleRemoveImage = (imageToBeRemoved) => {
    game.value.images = game.value.images.filter(savedImage => savedImage.id !== imageToBeRemoved.id);
  };

  const handleAddImage = async (newImage) => {
      game.value.images.push(newImage);
  };

  //Vuelidate:
  const linkToGameRegex = (value) => {
    return /^https:\/\/(.*?)\.github\.io\/(.*?)$/.test(value);
  }

  const isDownloadLinkProvided = () => {
    return game.value.link_to_download;
  }

  const rules = {
    name: {required},
    alias: {required},
    link_to_game: {
      requiredUnlessDownloadProvided: requiredUnless(isDownloadLinkProvided),
      linkToGameRegex: helpers.withMessage("El link debe ser un enlace válido de GitHub Pages", linkToGameRegex)},
    link_to_download: {url},
    description: {required},
    development_team: {required},
    release_date: {required},
    genres: {required},
    developers: {required},
    images: {required},
    logo_url: {required}
  };

  const $externalResults = ref({})

  const submitted = ref(false);

  const v$ = useVuelidate(rules, game, {$externalResults});

  const isProcessingRequest = ref(false)

  const getFormattedGameToSend = () => {
    let gameToSend = {...game.value};
    gameToSend.developers = gameToSend.developers.map((developer) => {
      return {name: developer}
    });
    gameToSend.release_date = formatGameDate(gameToSend.release_date);
    return gameToSend;
  };

  function handleFormData() {
    $externalResults.value = {};
    submitted.value = true;
    v$.value.$validate();
  }

  async function handleEdition() {
    await editGame(game.value.id, getFormattedGameToSend());
    toast.add({
      severity: 'success',
      summary: 'Operación exitosa',
      detail: 'Tu juego se ha editado correctamente',
      life: 3500
    });
    router.push('/dev/games');
  }

  async function handleCreation() {
    await createGame(getFormattedGameToSend());
    toast.add({ severity: 'success', summary: 'Operación exitosa', detail: 'Tu juego se ha publicado correctamente', life: 3500 });
    router.push('/dev/games');
  }

  const publishGame = async () => {
    isProcessingRequest.value = true;
    handleFormData();
    if (!v$.value.$error) {
      try {
        if (isEditMode.value) {
          await handleEdition();
        } else {
          await handleCreation();
        }
      } catch (error) {
        $externalResults.value = error.response.data.errors;
        toast.add({ severity: 'error', summary: 'Operación fallida', detail: 'Ocurrió un error durante la publicación de tu juego', life: 3500 });
      } finally {
        isProcessingRequest.value = false
      }
    } else {
      toast.add({ severity: 'error', summary: 'Operación fallida', detail: 'Algunos de los campos del formulario es inválido', life: 3500 });
    }
    isProcessingRequest.value = false
  }

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

  @media (max-width: 600px) {
    .flip-card {
      max-width: 100%;
      font-size: 0.1rem/* Asegura que la imagen se ajuste al contenedor */
    }

    .flip-card .front h3 {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 45px;
      padding: 1rem;
      font-size: 1.2rem;
      line-height: 15px;
      color: #fff;
      background: rgba(0, 0, 0, 0.4);
      text-align: center;
    }
  }

  .cancel-button {
    width: 100px;
    background-color: rgba(255, 255, 255, 0.87);
    border: none;
    color: #9b2a3a;
    transition: background-color 0.3s, color 0.3s;
  }

  .cancel-button:hover {
    background-color: rgba(255, 255, 255, 1) !important;
    color: #FF0000 !important;
  }
  </style>






