<template>
  <Toast />
  <ConfirmPopup></ConfirmPopup>
  <hr class="my-3">
  <div class="px-3 py-2">
    <div class="comment-header">
      <div class="flex justify-content-between align-items-center">
        <div>
          <p class="m-0">20 Enero, 2023</p>
          <Rating :cancel="false" class="mt-2" model-value="5" readonly />
        </div>
        <Button v-if="authStore.isAdmin()" v-tooltip="'Eliminar comentario'" icon="pi pi-times" rounded severity="danger" text @click="confirmDialog($event)" />
      </div>
      <h5 class="font-medium "><Avatar class="p-overlay-badge mr-2 pi pi-user" size="small" />nicolasdemaio</h5>
    </div>
    <p class="comment-content text-600">
      orem ipsuml orem ipsuml orem ipsuml orem ipsuml orem ipsuml
      orem ipsuml orem ipsuml orem ipsuml orem ipsuml orem ipsuml
    </p>
  </div>
</template>

<style>

</style>
<script setup>
import {useAuthStore} from "@/stores/authStore";
import {useConfirm} from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";

const confirm = useConfirm();
const toast = useToast();

const authStore = useAuthStore()

const confirmDialog = (event) => {
  confirm.require({
    target: event.currentTarget,
    message: '¿Estas seguro que deseas eliminar el comentario?',
    icon: 'pi pi-info-circle',
    accept: () => {
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
    }
  });
};
</script>