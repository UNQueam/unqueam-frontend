<template>
  <Dialog
      v-model:visible="showVisible"
      modal
      :style="{ width: avatarDialogWidth() }"
      header="Seleccioná un avatar"
      @hide="handleClose"
  >
    <hr class="mb-4 mt-0">
    <div class="avatar-container">
      <Avatar
          v-for="avatar in avatarsObjects"
          :image="avatar.img"
          class="mr-2 available-avatar"
          size="xlarge"
          v-bind:key="avatar.key"
          shape="circle"
          @click="handleChangeAvatar(avatar.key)"/>
    </div>
  </Dialog>
</template>

<script setup>
import {avatarsObjects} from "@/service/AvatarKeysResolver";
import {ref, watch} from "vue";
import {updateAvatar} from "@/service/UserProfileService";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  close: {
    type: Function,
    required: true
  },
  onUpdate: {
    type: Function,
    required: true
  }
});

const handleChangeAvatar = (avatarKey) => {
  updateAvatar(avatarKey);
  props.onUpdate(avatarKey);
  handleClose();
}

const showVisible = ref(props.visible);

watch(() => props.visible, (newValue) => {
  showVisible.value = newValue;
});

function handleClose() {
  props.close();
  showVisible.value = false;
}

const avatarDialogWidth = () => {
  if (window?.innerWidth <= 767) {
    return '90%'
  }
  if (window?.innerWidth <= 1300) {
    return '60%'
  }
  return '30%'
}
</script>

<style scoped>
.avatar-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.avatar-window {
  width: 30%;
}

@media (max-width: 767px) {
  .avatar-window {
    width: 30%;
  }
}

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