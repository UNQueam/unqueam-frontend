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
    <form @submit.prevent="handlePublish">
      <div class="flex flex-row gap-3">
      <div class="mb-5">
      <label class="block text-600 font-medium mb-2" for="name">Título del banner</label>
      <InputText v-model="banner.title" autofocus class="md:w-25rem w-full" type="text"/>

      <div class="error-container">
        <small v-for="error of v$.title.$errors" :key="error.$uid" class="p-error ml-2">{{ getCustomError("title", error.$validator, error) + ". " }}</small>
      </div>
      </div>

      <div class="mb-5">
        <label class="block text-600 font-medium mb-2" for="name">Enlace al banner</label>
        <div class="flex flex-column">
          <InputText v-model="banner.alias" class="md:w-25rem w-full" type="text"/>
          <small v-if="banner.alias" id="alias-help" class="mt-1 ml-2">Se verá asi en la url: <span class="font-medium" style="color:#9b2a3a"> /{{toKebabCase(banner.alias)}} </span> </small>
        </div>
        <div class="error-container">
          <small v-for="error of v$.alias.$errors" :key="error.$uid" class="p-error ml-2">{{ getCustomError("alias", error.$validator, error) + ". " }}</small>
        </div>
      </div>
      </div>

      <div class="mb-5">
      <Editor v-model="banner.rich_text" editorStyle="height: 320px"/>
      <div class="error-container">
        <small v-for="error of v$.rich_text.$errors" :key="error.$uid" class="p-error ml-2">{{ getCustomError("rich_text", error.$validator, error) + ". " }}</small>
      </div>
      </div>

      <label class="block text-600 font-medium mb-2" for="name">Imágen para el banner</label>
      <div class="flex flex-row gap-2">
        <FileUpload :chooseLabel="pictureUploadLabel" accept="image/*" auto customUpload mode="basic" name="demo[]" url="/api/upload" @uploader="uploadImage" />
        <Button :disabled="!banner.picture.byte_array_as_string" icon="pi pi-eye" label="Ver imágen" @click="showPicture"/>
        <Dialog v-model:visible="pictureModalIsVisible" header="Imágen de banner" modal>
           <Image :src="banner.picture.byte_array_as_string" alt="Image" class="w-full"></Image>
        </Dialog>
      </div>
      <div class="error-container">
        <small v-for="error of v$.picture.$errors" :key="error.$uid" class="p-error ml-2">{{ getCustomError("picture", error.$validator, error) + ". " }}</small>
      </div>

      <div class="flex flex-row justify-content-end mt-5 gap-3">
        <Button class="w-6rem cancel-button" label="Cancelar" type="button" @click="router.back()"></Button>
        <Button :label="isEditMode ? 'Editar' : 'Publicar'" :loading="isProcessingRequest" class="w-6rem" type="submit"></Button>
      </div>
    </form>
  </div>
  <hr class="mb-5">
  <Toast position="top-right"/>
</template>

<script setup>
import {computed, onBeforeMount, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useVuelidate} from "@vuelidate/core";
import {getCustomError} from "@/utils/FormErrorMessageHandler";
import {useToast} from "primevue/usetoast";
import {toKebabCase} from "@/utils/stringFormatter";
import {editBanner, fetchBannerById, publishBanner} from "@/service/BannersService";
import {required} from "@vuelidate/validators";

const toast = useToast();

// Handle edition --------------------------------------
const router = useRouter();
const route = useRoute();
const bannerId = computed(() => route.params.id);

const isEditMode = computed(() => !!bannerId.value);
//------------------------------------------------------

const showPicture = () => pictureModalIsVisible.value = !pictureModalIsVisible.value

const pictureModalIsVisible = ref(false)

const banner = ref({
  title: "",
  alias: "",
  rich_text: "",
  picture: {
    file_name: "",
    type: "",
    byte_array_as_string: "",
    size: null
  }
})

//Vuelidate:
const rules = {
  title: {required},
  alias: {required},
  rich_text: {required},
  picture: {required}
};

const $externalResults = ref({})

const v$ = useVuelidate(rules, banner, {$externalResults});

onBeforeMount(async () => {
  try {
    if (isEditMode.value) {
      const existingBanner = await fetchBannerById(bannerId.value);
      banner.value = {...banner.value, ...existingBanner};
      console.log(banner.value)
    }
  } catch (err) {
    //do nothing
  }
});
///// ------

async function handleEdition() {
  await editBanner(bannerId.value, banner.value);
  toast.add({
    severity: 'success',
    summary: 'Operación exitosa',
    detail: 'Tu banner se ha editado correctamente',
    life: 3500
  });
  router.push('/admin/banners');
}

async function handleCreation() {
  console.log(banner.value)
  await publishBanner(banner.value)

  toast.add({ severity: 'success', summary: 'Operación exitosa', detail: 'Tu banner se ha publicado correctamente', life: 3500 });
  router.push('/admin/banners');
}

const isProcessingRequest = ref(false)

const submitted = ref(false)

function handleFormData() {
  $externalResults.value = {};
  submitted.value = true;
  v$.value.$validate();
}

const handlePublish = async () => {
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
      toast.add({ severity: 'error', summary: 'Operación fallida', detail: 'Ocurrió un error durante la publicación de tu banner', life: 3500 });
    } finally {
      isProcessingRequest.value = false
    }
  } else {
    toast.add({ severity: 'error', summary: 'Operación fallida', detail: 'Algunos de los campos del formulario es inválido', life: 3500 });
  }
  isProcessingRequest.value = false
}

const pictureUploadLabel = computed(() => {
  return (banner.value?.picture.byte_array_as_string) ? 'Cambiar imágen' : 'Seleccionar imágen'
});

const uploadImage = async (event) => {
  const file = event.files[0];
  const reader = new FileReader();
  let blob = await fetch(file.objectURL).then((r) => r.blob());
  reader.readAsDataURL(blob);

  reader.onloadend = function () {
    const base64data = reader.result;
    banner.value.picture = {
      file_name: file.name,
      type: blob.type,
      byte_array_as_string: base64data,
      size: blob.size
    }
  };
};

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
