<template>
  <div>
    <div class="flex gap-5">
      <InputText id="images" v-model="imageUrl" class="w-full input-height" placeholder="URL de la imagen" style="padding: 1rem" type="text" />
      <Button class="input-height" type="button" @click="loadImageDimensions">Agregar imagen</Button>
    </div>

    <div class="w-full mt-5">
      <Galleria :value="images" :responsiveOptions="galleryResponsiveOptions" :numVisible="5" containerStyle="max-width: 640px; margin: auto"
                :showThumbnails="false" :showItemNavigatorsOnHover="true" :showIndicators="true" :circular="true"
                :changeItemOnIndicatorHover="true" :key="galleryRefreshKey">
        <template #item="slotProps" >
          <div class="image-container">
            <img :src="slotProps.item?.url" :alt="slotProps.item?.alt" class="game-image" />
            <button class="delete-button" @click="removeImage(slotProps.item)" type="button">
              <i class="pi pi-trash" style="color: white; font-size: 24px;"></i>
            </button>
          </div>
        </template>
      </Galleria>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import Galleria from 'primevue/galleria';

const imageUrl = ref('');
const imageWidth = ref(null);
const imageHeight = ref(null);
const { images } = defineProps(['images']);
const emit = defineEmits(['remove-image', 'add-image']);
const galleryRefreshKey = ref(0);
const nextImgId = ref(999)

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

const loadImageDimensions = () => {
  //ACA HAY QUE VER EL TEMA VALIDACIONES. Deje sentadas las bases para poder acceder al height y width y los imprimo abajo del input.
  if (imageUrl.value) {
    const img = new Image();
    img.src = imageUrl.value;

    img.onload = () => {
      imageWidth.value = img.width;
      imageHeight.value = img.height;
    };
    const newImage = {
      id: nextImgId.value,
      url: imageUrl.value
    };
    nextImgId.value++;

    //emit('update:images', localImages);
    emit('add-image', newImage);
  }
};
const removeImage = (imageToBeRemoved) => {
  emit('remove-image', imageToBeRemoved);
  galleryRefreshKey.value++;
};

const removeImaged = (imageToBeRemoved) => {
  galleryRefreshKey.value++; //Se usa esta key para refrescar el component gallery asi se ven reflejados los cambios.
  emit('update:images', localImages.value);
};
</script>