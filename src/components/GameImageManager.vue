<template>
  <div>
    <div class="flex gap-5">
      <InputText id="images" v-model="imageUrl" class="w-full mb-5 input-height" placeholder="URL de la imagen" style="padding: 1rem" type="text" />
      <Button class="input-height" type="button" @click="loadImageDimensions">Agregar imagen</Button>
    </div>

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
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Galleria from 'primevue/galleria';

const imageUrl = ref('');
const imageWidth = ref(null);
const imageHeight = ref(null);
const { images } = defineProps(['images']);
const localImages = ref(images);
const emit = defineEmits(['update:images']);
const galleryRefreshKey = ref(0);
const nextImgId = ref(0)
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
    localImages.value.push({
      id: localImages.value.length,
      itemImageSrc: imageUrl.value,
    });

    nextImgId.value = nextImgId.value + 1
    emit('update:images', localImages.value);
  }
};

const removeImage = (imageToBeRemoved) => {
  localImages.value = localImages.value.filter(savedImage => savedImage.id !== imageToBeRemoved.id);
  galleryRefreshKey.value++; //Se usa esta key para refrescar el component gallery asi se ven reflejados los cambios.
  emit('update:images', localImages.value);
};
</script>