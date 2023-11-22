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
            :image="getAvatarImage(profile?.profile?.image_id)"
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
          <span class="font-medium text-2xl">{{ profile.username }}</span>
          <span class="text-600 font-medium">{{ profile.email }}</span>
        </div>
      </div>
      <div class="flex-wrap">
        <div class="card p-3" style="background-color: #292c2f;">
          <div class="flex flex-row justify-content-between align-items-center mb-3">
            <p class="font-bold my-auto">BIOGRAFIA</p>
            <i v-if="canUserEditProfile && !isEditingBiography" class="pi pi-pencil cursor-pointer" @click="showEditAboutInput" v-tooltip.left="'Editar información'"></i>
            <div v-if="canUserEditProfile && isEditingBiography" class="flex flex-row gap-3">
              <Button class="p-button-link m-0 p-0">Guardar</Button>
              <Button class="p-button-link m-0 p-0" @click="handleCancelEditAbout">Cancelar</Button>
            </div>
          </div>
          <p v-if="!isEditingBiography && !userBiography" class="text-700 font-italic">No hay información para mostrar.</p>
          <p v-if="!isEditingBiography && userBiography" class="text-700">{{ userBiography }}</p>
          <Textarea v-if="isEditingBiography" v-model="userBiography" class="w-full"/>
        </div>
        <div class="card p-3" style="background-color: #292c2f;">
          <p class="font-bold">JUEGOS FAVORITOS</p>
          <p v-if="favoriteGames.length === 0" class="text-700 font-italic">El usuario no tiene juegos Favoritos.</p>
          <div v-if="favoriteGames.length > 0" class="flex flex-column gap-2">
            <div v-for="favoriteGame in favoriteGames" class="flex align-items-center justify-content-between" :key="favoriteGame.id">
              <div class="flex align-items-center">
                <i class="pi pi-angle-right text-gray-200"></i>
                <span class="favorite-game-title" @click="toggleGamePanel">{{ favoriteGame?.game?.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ChangeAvatarDialog :visible="shouldShowAvatarChangeMenu" :close="() => {shouldShowAvatarChangeMenu = false}"/>
  </Dialog>
</template>

<script setup>
import {getAvatarImage} from "@/service/AvatarKeysResolver";
import {onBeforeMount, ref, watch} from "vue";
import ChangeAvatarDialog from "@/components/ChangeAvatarDialog.vue";
import {fetchFavoriteGamesOfAuthUser} from "@/service/FavoriteGamesService";
import {fetchUserById} from "@/service/UsersService";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  close: {
    type: Function,
    required: true
  },
  editable: {
    type: Boolean,
    required: false,
  },
  userId: {
    type: Number,
    required: true
  }
});

const showEditAboutInput = () => {
  isEditingBiography.value = true
}

const handleCancelEditAbout = () => {
  isEditingBiography.value = false
  // todo: limpiar texto o dejar como esta
}

const userBiography = ref()

const isEditingBiography = ref(false)

const profile = ref({});

const canUserEditProfile = ref(false)

const favoriteGames = ref([])

onBeforeMount(async () => {
  canUserEditProfile.value = (props.editable) ? props.editable : false;
  const response = await fetchUserById(props.userId)
  profile.value = response;
  userBiography.value = response.profile.description ? response.profile.description : "";
  favoriteGames.value = await fetchFavoriteGamesOfAuthUser(props.userId)
})

const dialogVisible = ref(props.visible);

watch(() => props.visible, (newValue) => {
  dialogVisible.value = newValue;
});

function handleClose() {
  props.close();
  favoriteGames.value = []
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

.favorite-game-title {
  font-size: 1.1rem;
  color: #bdc0c4;
  font-weight: 500;
}

.available-avatar {
  width: 9rem;
  height: 9rem;
  margin: 0.5rem;
  border-radius: 50%;
  padding: 0.5rem;
  transition-duration: 0.5s;
}
</style>