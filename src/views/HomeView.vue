<script setup>

import { ref, computed, onMounted } from 'vue'
import { fetchData } from "@/service/GamesService"

// Data
const filterKey = ref('')
// Otros datos y propiedades


const games = ref([]);
const error = ref([]);

onMounted(async () => {
      try {
        const result = await fetchData();
        games.value = result;
      } catch (err) {
        error.value = err;
      }
    });

//Mock Data
const dataviewValue = ref(null)
dataviewValue.value = [
  {
    id: '1000',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5
  },
  {
    id: '1001',
    code: 'nvklal433',
    name: 'Black Watch',
    description: 'Product Description',
    image: 'black-watch.jpg',
    price: 72,
    category: 'Accessories',
    quantity: 61,
    inventoryStatus: 'INSTOCK',
    rating: 4
  },
  {
    id: '1002',
    code: 'zz21cz3c1',
    name: 'Blue Band',
    description: 'Product Description',
    image: 'blue-band.jpg',
    price: 79,
    category: 'Fitness',
    quantity: 2,
    inventoryStatus: 'LOWSTOCK',
    rating: 3
  },
  {
    id: '1003',
    code: '244wgerg2',
    name: 'Blue T-Shirt',
    description: 'Product Description',
    image: 'blue-t-shirt.jpg',
    price: 29,
    category: 'Clothing',
    quantity: 25,
    inventoryStatus: 'INSTOCK',
    rating: 5
  },
  {
    id: '1004',
    code: 'h456wer53',
    name: 'Bracelet',
    description: 'Product Description',
    image: 'bracelet.jpg',
    price: 15,
    category: 'Accessories',
    quantity: 73,
    inventoryStatus: 'INSTOCK',
    rating: 4
  },
  {
    id: '1005',
    code: 'av2231fwg',
    name: 'Brown Purse',
    description: 'Product Description',
    image: 'brown-purse.jpg',
    price: 120,
    category: 'Accessories',
    quantity: 0,
    inventoryStatus: 'OUTOFSTOCK',
    rating: 4
  },
  {
    id: '1006',
    code: 'bib36pfvm',
    name: 'Chakra Bracelet',
    description: 'Product Description',
    image: 'chakra-bracelet.jpg',
    price: 32,
    category: 'Accessories',
    quantity: 5,
    inventoryStatus: 'LOWSTOCK',
    rating: 3
  },
  {
    id: '1007',
    code: 'mbvjkgip5',
    name: 'Galaxy Earrings',
    description: 'Product Description',
    image: 'galaxy-earrings.jpg',
    price: 34,
    category: 'Accessories',
    quantity: 23,
    inventoryStatus: 'INSTOCK',
    rating: 5
  },
  {
    id: '1008',
    code: 'vbb124btr',
    name: 'Game Controller',
    description: 'Product Description',
    image: 'game-controller.jpg',
    price: 99,
    category: 'Electronics',
    quantity: 2,
    inventoryStatus: 'LOWSTOCK',
    rating: 4
  },
  {
    id: '1009',
    code: 'cm230f032',
    name: 'Gaming Set',
    description: 'Product Description',
    image: 'gaming-set.jpg',
    price: 299,
    category: 'Electronics',
    quantity: 63,
    inventoryStatus: 'INSTOCK',
    rating: 3
  }
]

// Propiedad computada para filtrar los datos
const filteredData = computed(() => {
  const lowerCaseFilter = filterKey.value.toLowerCase()
  return dataviewValue.value.filter(
    (item) =>
      item.name.toLowerCase().includes(lowerCaseFilter) ||
      item.description.toLowerCase().includes(lowerCaseFilter)
  )
})

const layout = ref('grid')
</script>

<template>
  <div>
    <div class="col-10 m-auto mt-5 mb-5">
      <div class="card">
        <div class="title">
          <h5>Juegos</h5>
          {{games}}
        </div>
        <DataView :value="filteredData" :layout="layout" :paginator="true" :rows="9">
          <template #header>
            <div class="grid grid-nogutter">
              <div class="col-6 mt-3 col-offset-3">
                <InputText v-model="filterKey" placeholder="Search" />
              </div>
              <div v-if="!layout === 'grid'" class="col-offset-2 col-1">
                <DataViewLayoutOptions v-model="layout" />
              </div>
            </div>
          </template>

          <template #grid="slotProps">
            <div class="col-12 md:col-6 lg:col-4">
              <div class="flip-card">
                <div class="face front">
                  <img
                    src="https://image.api.playstation.com/vulcan/ap/rnd/202308/1002/1c63f7e89a8010eaec68d2dd622b42d3f2290e44e1d8168e.png"
                    class="shadow-2 my-1 mx-0"
                  />
                  <h3 class="text-center">{{ slotProps.data.name }}</h3>
                </div>

                <div class="face back">
                  <h3>{{ slotProps.data.name }}</h3>
                  <div class="mb-3">{{ slotProps.data.description }}</div>
                  <div class="card-link">
                    <button class="button-50" type="button">Go to game</button>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  text-align: center;
}

.grid-nogutter > .col,
.grid-nogutter > [class*='col-'] {
  padding: 0;
  justify-content: center;
  display: flex;
  margin-top: 0px !important;
  align-content: center;
  align-items: center;
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
  transition: 0.5s;
}

.flip-card .front {
  transform: perspective(600px) rotateY(0deg);
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
  text-align: center();
}

.flip-card .back {
  transform: perspective(600px) rotateY(180deg);
  background: #9b2a3a;
  padding: 15px;
  color: #f3f3f3;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  box-shadow: 0 5px 10px #000;
}

.flip-card .back .card-link {
  height: 50px;
  line-height: 50px;
}

.flip-card .back .card-link a {
  color: #f3f3f3;
}

.flip-card .back h3 {
  font-size: 30px;
  margin-top: 20px;
  letter-spacing: 2px;
}

.flip-card .back p {
  letter-spacing: 1px;
}

.flip-card:hover .front {
  transform: perspective(600px) rotateY(180deg);
}

.flip-card:hover .back {
  transform: perspective(600px) rotateY(360deg);
}

.button-50 {
  appearance: button;
  background-color: #000;
  background-image: none;
  border: 1px solid #000;
  border-radius: 4px;
  box-shadow:
    #fff 4px 4px 0 0,
    #000 4px 4px 0 1px;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-family: ITCAvantGardeStd-Bk, Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  margin: 0 5px 10px 0;
  overflow: visible;
  padding: 12px 40px;
  text-align: center;
  text-transform: none;
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
  vertical-align: middle;
  white-space: nowrap;
}

.button-50:focus {
  text-decoration: none;
}

.button-50:hover {
  text-decoration: none;
}

.button-50:active {
  box-shadow: rgba(0, 0, 0, 0.125) 0 3px 5px inset;
  outline: 0;
}

.button-50:not([disabled]):active {
  box-shadow:
    #fff 2px 2px 0 0,
    #000 2px 2px 0 1px;
  transform: translate(2px, 2px);
}

@media (min-width: 768px) {
  .button-50 {
    padding: 12px 50px;
  }
}
</style>
