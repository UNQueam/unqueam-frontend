<template>
  <Dialog
      v-model:visible="dialogVisible"
      modal
      header="Perfíl"
      :style="{ width: profileDialogWidth() }"
      @hide="handleClose"
  >
    <div>
      <div class="gap-1 mb-5 flex flex-column align-items-center">
        <Avatar
            :image="getAvatarImage('zeus')"
            shape="circle"
            class="available-avatar"
            style="background-color: #0b0b0b; border: 1px solid #c1272d; border-radius: 50%; "
            v-on:mouseover="showEditIcon = true"
            v-on:mouseout="showEditIcon = false"
        >
          <i
              v-if="showEditIcon && canUserEditProfile"
              v-tooltip.left="'Cambiar avatar'"
              class="pi pi-pencil edit-icon "
              @click="handleOpenAvatarsMenu"
          />
        </Avatar>
        <div class="flex flex-column align-items-center gap-1">
          <span class="font-medium text-2xl">hulk</span>
          <span class="text-600 font-medium">hulk@gmail.com</span>
        </div>
      </div>
      <div class="flex-wrap">
        <div class="card p-3" style="background-color: #292c2f;">
          <div class="flex flex-row justify-content-between">
            <p class="font-bold">ABOUT</p>
            <i v-if="canUserEditProfile" class="pi pi-pencil"></i>
          </div>
          <p class="text-700 font-italic">No hay información para mostrar.</p>
        </div>
        <div class="card p-3" style="background-color: #292c2f;">
          <div class="flex flex-row justify-content-between">
            <p class="font-bold">JUEGOS FAVORITOS</p>
            <i v-if="canUserEditProfile" class="pi pi-pencil"></i>
          </div>
          <p class="text-700 font-italic">El usuario no tiene juegos Favoritos.</p>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import {getAvatarImage} from "@/service/AvatarKeysResolver";
import {onMounted, ref, watch} from "vue";
import {useAuthStore} from "@/stores/authStore";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  close: {
    type: Function,
    required: true
  }
});

const canUserEditProfile = ref(false)

onMounted(async () => {
  canUserEditProfile.value = useAuthStore().getUsername() === 'hulk'
})

const dialogVisible = ref(props.visible);

watch(() => props.visible, (newValue) => {
  dialogVisible.value = newValue;
});

function handleClose() {
  props.close();
  dialogVisible.value = false;
}

const profileDialogWidth = () => {
  if (window?.innerWidth <= 767) {
    return '90%'
  }
  if (window?.innerWidth <= 1300) {
    return '40%'
  }
  return '20%'
}

const handleOpenAvatarsMenu = () => {
  shouldShowAvatarChangeMenu.value = true
}

const shouldShowAvatarChangeMenu = ref(false)

const showEditIcon = ref(false);
</script>

<style scoped>
.available-avatar {
  width: 9rem;
  height: 9rem;
  margin: 0.5rem;
  border-radius: 50%;
  padding: 0.5rem;
  transition-duration: 0.5s;
}

.available-avatar:hover {
  transition-duration: 0.1s;
  border: 3px solid #bf272d;
  cursor: pointer;
}
</style>