<template>
  <div v-if="files.length === 0" class="card">
        <div class="flex align-items-center justify-content-center flex-column"
             @drop="onFileDrop" @dragover.prevent>
          <i class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400" />
          <p class="mt-4 mb-0">Arrastrá y soltá las imágenes para cargarlos.</p>
        </div>
  </div>
  <div v-if="files.length > 0">
    <div class="card flex align-items-center justify-content-between p-3 mb-2">
      <div class="flex align-items-center gap-2">
      <Image alt="Image" src="https://primefaces.org/cdn/primevue/images/galleria/galleria10.jpg" width="80"  />
      <div>
        <div class="flex align-items-center gap-1">
          <span class="">foto.png</span>
          <Tag severity="success" value="Nueva"></Tag>
        </div>
        <span>888555 KB</span>
      </div>
      </div>
      <Button v-tooltip="'Eliminar imágen'" aria-label="Cancel" icon="pi pi-times" rounded severity="danger" text/>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";

const files = ref([]);

const onFileDrop = (event) => {
  event.preventDefault();
  // todo: deberia ser un append. Ademas, si max img = 5 > si selecciona 6, tomamos las primeras 5 y avisamos
  // todo: cargar bien los archivos con FileReader (mirar primevue FileUpload)
  files.value = event.dataTransfer.files;
  console.log(event.dataTransfer.files)
}
</script>