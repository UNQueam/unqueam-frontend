<script setup>
import DataView from 'primevue/dataview';
import 'primeflex/primeflex.css';

import {computed, onBeforeMount, ref} from "vue";
import {useAuthStore} from "@/stores/authStore";
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";
import Checkbox from 'primevue/checkbox';
import {activateBanner, deactivateBanner, fetchAllBanners} from "@/service/BannersService";

const router = useRouter()

const authStore = useAuthStore();

const banners = ref([]);

const toast = useToast();

const inputKey = ref('');

const onlyActiveBanners = ref(false);

onBeforeMount(async () => {
  try {
    banners.value = await fetchAllBanners();
  } catch (err) {
    //do nothing
  }
});

const showToggleHideStatusSuccess = () => {
  toast.add({
    severity: 'success',
    summary: 'Estado cambiado',
    detail: 'Se ha cambiado satisfactoriamente el estado del banner',
    life: 5000
  });
}
const showToggleHideStatusFailure = () => {
  toast.add({
    severity: 'error',
    summary: 'Estado no cambiado',
    detail: 'Algo ha ocurrido, intenta nuevamente mas tarde',
    life: 5000
  });
}

const isHideSwitcherEnabled = computed(() => {
  return (is_active) => {
    return (!isHideSwitcherLoading.value && activeBannersAreAmongTheLimit()) || is_active;
  }

})

const isHideSwitcherLoading = ref(false);

const toggleSwitcher = async (bannerId) => {
  if (! isHideSwitcherLoading.value) {
    isHideSwitcherLoading.value = true;
    setTimeout(() => {
      isHideSwitcherLoading.value = false;
    }, 2000);
  }
  try {
    const banner = banners.value.filter(banner => banner.banner_id === bannerId)[0]
    const is_active = banner.is_active;
    if (is_active) {
      await activateBanner(bannerId);
      showToggleHideStatusSuccess();
    } else {
      await deactivateBanner(bannerId);
      showToggleHideStatusSuccess();
    }
    banners.value[banners.value.indexOf(banner)].is_active = !is_active;
  } catch (error) {
    showToggleHideStatusFailure();
  }
};

const goToBanner = (alias) => {
  router.push("/banners/" + alias)
}

const stopPropagation = (event) => {
  event.stopPropagation();
}

const iconClass = computed(() => {
  return (is_active) => {
    if (isHideSwitcherLoading.value) {
      return 'pi pi-spinner pi-spin';
    } else {
      if (is_active) {
        return 'pi pi-check';
      } else {
        return 'pi pi-times';
      }
    }
  }

});

const goToNewBannersForm = () => {
  router.push("/admin/banners/publish")
}

const editBanner = (bannerId) => {
  router.push("/admin/banners/" + bannerId + "/edit")
}

const filteredData = computed(() => {
  const lowerCaseFilter = inputKey.value.toLowerCase()
  return banners.value.filter(
      (item) => {
        if (onlyActiveBanners.value) {
          return item.title.toLowerCase().includes(lowerCaseFilter) && item.is_active;
        } else {
          return item.title.toLowerCase().includes(lowerCaseFilter);
        }
      }
  )
})

function activeBannersAreAmongTheLimit() {
  return banners.value.filter(banner => banner.is_active).length < 5;
}

const switcherTooltipText = computed(() => {
  return (is_active) => {
    if (!is_active && !activeBannersAreAmongTheLimit()) {
      return "Solo puede haber hasta 5 banners activos";
    } else {
      if (is_active) {
        return "Deseleccionar banner"
      } else {
        return "Seleccionar banner"
      }
    }
  }

});

</script>

<template>
  <div class="col-9 m-auto surface-section px-4 py-5 md:px-6 lg:px-8">
    <ul class="list-none p-0 m-0 flex align-items-center font-medium mb-3">
      <li>
        <router-link to="/" class="text-500 no-underline line-height-3 cursor-pointer">Home</router-link>

      </li>
      <li class="px-2">
        <i class="pi pi-angle-right text-500 line-height-3"></i>
      </li>
      <li>
        <span class="text-900 line-height-3">Banners</span>
      </li>
    </ul>
    <div class="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
      <div class="font-medium text-3xl text-900">Banners</div>
      <div class="mt-3 lg:mt-0">
        <Button class=" mr-2" icon="pi pi-plus" label="Publicar" @click="goToNewBannersForm"></Button>
      </div>
    </div>
  </div>
  <div class="card col-9 m-auto mt-5">
    <DataView :value="filteredData" paginator :rows="5">
      <template #header>
        <div class="lg:col-3 lg:col-offset-1 md:col-3 sm:col-3 flex flex-column m-auto gap-2">
          <InputText style="width: 250px;" v-model="inputKey" placeholder="Buscar"/>
          <div class="ml-2">
            <Checkbox v-model="onlyActiveBanners" :binary="true"/>
            <label for="ingredient2" class="ml-2"> Activos </label>
          </div>
        </div>

      </template>

      <template #empty>
        <div class="no-banners mb-5 mt-5"> No se encontraron banners.</div>
      </template>
      <template #list="slotProps">
        <div class="col-12 clickeable-item" @click="goToBanner(slotProps.data.alias)">
          <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4 h-full">
            <img :alt="slotProps.data.alias" :src="slotProps.data.picture.byte_array_as_string" class=" "
                 style="max-height: 160px; min-height: 160px; object-fit:cover;"/>
            <div
                class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4 h-full">
              <div class="font-bold text-5xl m-auto" style="font-size: 15px;">{{ slotProps.data.title }}</div>
              <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2"
                   @click="stopPropagation">
                <Button icon="pi pi-pencil" rounded v-tooltip="'Editar juego'"
                        @click="editBanner(slotProps.data.banner_id)"></Button>
                <label v-tooltip="switcherTooltipText(slotProps.data.is_active)" class="switcher" @click="stopPropagation">
                  <input v-model="slotProps.data.is_active" :disabled="!isHideSwitcherEnabled(slotProps.data.is_active)" class="switcher-input" type="checkbox" @click="toggleSwitcher(slotProps.data.banner_id)">
                  <span class="switcher-slider">
                <span class="slider-circle">
                  <i :class="iconClass(slotProps.data.is_active)"></i>
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
  <hr class="my-5 opacity-0">
  <Toast position="top-right"/>
</template>

<style scoped>
.switcher {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
  background-color: #2a2a2a;
  border-radius: 15px;
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
  background-color: #2a2a2a;
  border-radius: 15px;
  transition: 0.4s;
}

.slider-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background-color: #717171;
  border-radius: 50%;
  transition: 0.4s;
  transform: translateX(0);
}

.switcher-slider i.pi-check {
  color: #00A65A;
}

.switcher-slider i.pi-times {
  color: red;
}

.switcher-input:checked + .switcher-slider .slider-circle {
  background-color: #9b2a3a;
  transform: translateX(30px);
}

.clickeable-item {
  cursor: pointer;
  transition: background-color 0.3s;
}


.clickeable-item:hover {
  animation: bounce 0.8s;
  background-color: #414141;
}


@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}

.no-banners {
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 18px;
  transition: color 0.3s;
}

</style>