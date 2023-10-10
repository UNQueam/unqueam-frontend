<script setup>
import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'
import 'primeflex/primeflex.css';
import InputSwitch from 'primevue/inputswitch';

import { ref, onMounted } from "vue";

onMounted(() => {
  //ProductService.getProductsSmall().then((data) => (products.value = data));

});

const products = ref();
const inputKey = ref('');
const sortKey = ref();
const sortOrder = ref();
const sortField = ref();
const sortOptions = ref([
  {label: 'Valoraciones de mejor a peor', value: '!rating'},
  {label: 'Valoraciones de peor a mejor', value: 'rating'},
  {label: 'Comentarios de mayor a menor cantidad', value: '!comments'},
  {label: 'Comentarios de menor a mayor cantidad', value: 'comments'},
]);
const onSortChange = (event) => {
  const value = event.value.value;
  const sortValue = event.value;

  if (value.indexOf('!') === 0) {
    sortOrder.value = -1;
    sortField.value = value.substring(1, value.length);
    sortKey.value = sortValue;
  }
  else {
    sortOrder.value = 1;
    sortField.value = value;
    sortKey.value = sortValue;
  }
};

products.value = [{
  id: '1000',
  code: 'f230fh0g3',
  name: 'Overwacho',
  description: 'Product Description',
  image: 'https://image.api.playstation.com/vulcan/ap/rnd/202308/1002/1c63f7e89a8010eaec68d2dd622b42d3f2290e44e1d8168e.png',
  price: 65,
  comments: 15,
  quantity: 24,
  rating: 5
},
  {
    id: '1012',
    code: 'f230fh0g3',
    name: 'Cyberporrrr',
    description: 'Product Description',
    image: 'https://sm.ign.com/ign_es/game/c/cyberpunk-/cyberpunk-2077_ygyu.jpg',
    price: 62,
    comments: 4,
    quantity: 24,
    rating: 4
  },
  {
    id: '1030',
    code: 'f230fh0g3',
    name: 'Dotita',
    description: 'Product Description',
    image: 'data:image/jpeg;base64,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',
    price: 6,
    comments: 12,
    quantity: 24,
    rating: 3
  }]
</script>

<template>
  <div class="card">
    <DataView :value="products" paginator :rows="5" :sortOrder="sortOrder" :sortField="sortField">
      <template #header>
        <div class="flex justify-content-center mb-5 text-2xl font-bold text-900">
          Mis Juegos
        </div>
        <div class="flex sm:flex-column md:flex-column lg:flex-row flex-wrap gap-4">
          <div class="lg:col-4 md:col-3 sm:col-3">
            <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Selecciona un orden" @change="onSortChange($event)" />
          </div>
          <div class="lg:col-3 lg:col-offset-1 md:col-3 sm:col-3">
            <InputText style="width: 260px;" v-model="inputKey" placeholder="Buscar" />
          </div>
        </div>
      </template>
      <template #list="slotProps">
        <div class="col-12">
          <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
            <img class="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" :src="slotProps.data.image" :alt="slotProps.data.name" />
            <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
              <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                <div class="text-2xl font-bold text-900 xl:w-10rem">{{ slotProps.data.name }}</div>
                <Rating :modelValue="slotProps.data.rating" readonly :cancel="false"></Rating>
                <div class="flex align-items-center gap-3">
                                    <span class="flex align-items-center gap-2">
                                        <span class="font-semibold">{{ slotProps.data.comments }} comentarios</span>
                                    </span>
                </div>
              </div>
              <div>lorem lorem lorem lorem lorem lorem lorem loremlorem lorem lorem loremlorem lorem lorem loremlorem
                lorem lorem lolorem lorem loremlorem lorem lorem lorem lorem lorem lorem loremlorem lorem lorem loremlorem lorem lorem loremlorem
                lorem lorem lo lorem lorem lorem lorem loremlorem lorem lorem loremlorem lorem lorem loremlorem
                lorem lorem lolorem lorem lorem lorem lorem lorem lorem loremlorem lorem lorem loremlorem lorem lorem loremlorem
                lorem lorem lo</div>
              <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                <Button icon="pi pi-eye" rounded :disabled="slotProps.data.inventoryStatus === 'OUTOFSTOCK'"></Button>
                <Button icon="pi pi-pencil" rounded :disabled="slotProps.data.inventoryStatus === 'OUTOFSTOCK'"></Button>
                <label class="switcher">
                  <input type="checkbox" class="switcher-input">
                  <span class="switcher-slider">
                    <span class="slider-circle">
                      <i class="pi pi-ban"></i>
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </div>
</template>

<style scoped>
.switcher {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
  background-color: #2a2a2a; /* Color rojo predominante */
  border-radius: 15px; /* Bordes circulares */
  overflow: hidden;
}

.switcher-input {
  display: none;
}

.switcher-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #2a2a2a; /* Color del slider */
  border-radius: 15px; /* Bordes circulares */
  transition: 0.4s; /* Animación de transición */
}

.slider-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background-color: #717171; /* Color rojo predominante para la esfera */
  border-radius: 50%; /* Forma de esfera */
  transition: 0.4s; /* Animación de transición */
  transform: translateX(0); /* Restablece la posición inicial */
}

.switcher-slider i.pi-ban {
  color: white; /* Color blanco para el icono "pi-ban" dentro de la esfera */
}

.switcher-input:checked + .switcher-slider .slider-circle {
  background-color: #9b2a3a; /* Cambia el color de la esfera cuando está activo */
  transform: translateX(30px); /* Mueve la esfera a la derecha cuando está activo */
}
</style>