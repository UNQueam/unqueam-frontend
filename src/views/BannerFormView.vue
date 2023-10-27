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
        <router-link class="text-500 no-underline line-height-3 cursor-pointer" to="/dev/games">Banners</router-link>
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
    <form @submit.prevent="publishBanner">
      <div class="flex flex-row gap-3">
      <div class="mb-5">
      <label class="block text-600 font-medium mb-2" for="name">Título del banner</label>
      <InputText v-model="banner.title" class="md:w-25rem w-full" placeholder="El título del banner" type="text"/>

      <div class="error-container">
        <small v-for="error of v$.title.$errors" :key="error.$uid" class="p-error ml-2">{{ getCustomError("title", error.$validator, error) + ". " }}</small>
      </div>
      </div>

      <div class="mb-5">
        <label class="block text-600 font-medium mb-2" for="name">Enlace al banner</label>
        <InputText v-model="banner.link" class="md:w-25rem w-full" placeholder="Ejemplo: /feria-de-juegos" type="text"/>

        <div class="error-container">
          <small v-for="error of v$.link.$errors" :key="error.$uid" class="p-error ml-2">{{ getCustomError("link", error.$validator, error) + ". " }}</small>
        </div>
      </div>
      </div>

      <Editor v-model="banner.rich_text" class="mb-5" editorStyle="height: 320px"/>

      <label class="block text-600 font-medium mb-2" for="name">Imágen para el banner</label>
      <div class="flex flex-row gap-2">
        <FileUpload accept="image/*" auto chooseLabel="Seleccionar imágen" customUpload mode="basic" name="demo[]" url="/api/upload" @uploader="uploadImage" />
        <Button icon="pi pi-eye" label="Ver imágen" @click="showPicture"/>
        <Dialog v-model:visible="pictureModalIsVisible" :style="{ width: '50vw' }" header="Imágen de banner" modal>
          <div class="w-full">
            <Image alt="Image" src="https://primefaces.org/cdn/primevue/images/galleria/galleria10.jpg"/>
          </div>
        </Dialog>
      </div>

      <div class="flex flex-row justify-content-end mt-5 gap-3">
        <Button :loading="false" class="w-6rem cancel-button" label="Cancelar" type="button" @click="router.back()"></Button>
        <Button :label="isEditMode ? 'Editar' : 'Publicar'" :loading="false" class="w-6rem" type="submit"></Button>
      </div>
    </form>
  </div>
  <hr class="mb-5">
  <Toast position="top-right"/>
</template>

<script setup>
import {computed, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {getCustomError} from "@/utils/FormErrorMessageHandler";
import {useToast} from "primevue/usetoast";

const toast = useToast();

// Handle edition --------------------------------------
const router = useRouter();
const route = useRoute();
const gameAlias = computed(() => route.params.alias);

const isEditMode = computed(() => !!gameAlias.value);
//------------------------------------------------------

const showPicture = () => pictureModalIsVisible.value = !pictureModalIsVisible.value

const pictureModalIsVisible = ref(false)

const banner = ref({
  title: "",
  link: "",
  rich_text: "",
  picture: {
    file_name: "",
    type: "",
    byte_array_as_string: "",
    size: null
  }
})

const publishBanner = () => {
  console.log(banner.value.rich_text)
}

const uploadImage = async (event) => {
  const file = event.files[0];
  console.log(file.type)
  console.log(file.size)
  console.log(file.byte)
  const reader = new FileReader();
  let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url

  reader.readAsDataURL(blob);

  reader.onloadend = function () {
    const base64data = reader.result;
    alert(base64data)
  };
};

//Vuelidate:
const rules = {
  title: {required},
  link: {required},
  picture: {required}
};

const $externalResults = ref({})

const v$ = useVuelidate(rules, banner, {$externalResults});

</script>

<style>
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
