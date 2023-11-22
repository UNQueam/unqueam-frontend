<template>
  <Toast />
  <ConfirmPopup></ConfirmPopup>
  <hr class="my-3">
  <div v-if="!isEditing" class="px-3 py-2">
    <div class="comment-header">
      <div class="flex justify-content-between align-items-center">
        <div>
          <div class="flex flex-row gap-2">
          <p class="m-0 small text-500">{{ comment.creation_date }} </p>
            <span class="small text-500">|</span>
          <p class="m-0 small text-500">editado en {{ comment.last_modification }} </p>
          </div>
          <Rating v-model="comment.rating" :cancel="false" class="mt-2" readonly />
        </div>
        <div class="flex flex-column justify-content-center align-items-center m-0 p-0">
          <Button v-if="canEditAComment()" v-tooltip="'Editar comentario'" icon="pi pi-pencil" rounded severity="danger" text @click="editCommentForm" data-cy="edit-comment"/>
          <Button v-if="canDeleteAComment()" v-tooltip="'Eliminar comentario'" icon="pi pi-times" rounded severity="danger" text @click="confirmDialog($event)" data-cy="delete-comment" />
        </div>
      </div>
      <div class="flex flex-row align-items-center" @click="handleOpenProfile">
        <Avatar class="p-overlay-badge mr-2 cursor-pointer" size="small" icon="pi pi-user"/>
        <h5 class="font-medium mt-2 cursor-pointer w-fit comment-username">{{ comment.publisher.username }}</h5>
      </div>
    </div>
    <p class="comment-content text-700" data-cy="comment-content">
      {{ comment.content }}
    </p>
  </div>
  <div>
    <form v-if="isEditing" class="my-4 card p-4">
      <div class=" shaking-input flex align-items-center gap-2 ml-3">
        <p class="m-0 p-0 text-500">Valoración</p>
        <Rating v-model="commentStructure.rating" :cancel="false" :class="{ 'p-invalid': submitted && v$.rating.$error }" class="m-0 p-0"/>
      </div>

      <Textarea v-model="commentStructure.comment"  class="w-full mt-3 p-2" rows="4" data-cy="edit-comment-field"/>
      <div class="error-container">
        <small v-for="error of v$.comment.$errors" :key="error.$uid" class="p-error">{{ getCustomError("comment", error.$validator, error) + ". " }}</small>
        <small v-for="error of v$.rating.$errors" :key="error.$uid" class="p-error">{{ getCustomError("rating", error.$validator, error) + ". " }}</small>
      </div>

      <div class="flex justify-content-end gap-2 mt-3">
        <Button class="cancel-button p-2" label="Cancelar" @click="cancelComment"></Button>
        <Button :loading="false" class="p-2" label="Enviar reseña" type="button" @click="handleEdit" data-cy="edit-comment-button"></Button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.comment-username {
  color: #d0d0d0;
  transition: 0.2s;
}

.comment-username:hover {
  color: #f3f3f3;
  transition: 0.2s;
}
</style>

<script setup>
import {useAuthStore} from "@/stores/authStore";
import {useConfirm} from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";
import {deleteComment, editComment} from "@/service/GamesService";
import {getCustomError} from "@/utils/FormErrorMessageHandler";
import {ref} from "vue";
import {helpers, minLength, required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";

const props = defineProps({
  comment: {
    type: Object,
    required: true
  },
  deleteCommentFn: {
    type: Function,
    required: true
  },
  handleShowProfileFn: {
    type: Function,
    required: true
  }
});

const handleOpenProfile = () => {
  props.handleShowProfileFn(comment.value.publisher.publisher_id)
}

const commentRating = (value) => {
  return value != null && value > 0 && value <=5
}

const isEditing = ref(false);

const comment = ref(props.comment);

const confirm = useConfirm();
const toast = useToast();

const authStore = useAuthStore()

const editCommentForm = () => {
  isEditing.value = !isEditing.value
  commentStructure.value = { comment: comment.value.content, rating: comment.value.rating }
}

const canDeleteAComment = () => (authStore.isAdmin() || authStore.getUsername === comment.value.publisher.username)

const canEditAComment = () => (authStore.getUsername === comment.value.publisher.username)

const confirmDialog = (event) => {
  confirm.require({
    target: event.currentTarget,
    message: '¿Estas seguro que deseas eliminar el comentario?',
    icon: 'pi pi-info-circle',
    acceptLabel: 'Sí. eliminar',
    rejectLabel: 'No',
    accept: async () => {
      try {
        await deleteComment({ gameId: comment.value.game_id, commentId: comment.value.comment_id });
        props.deleteCommentFn(comment.value.comment_id)
        toast.add({ severity: 'success', summary: 'Operación exitosa', detail: 'Comentario eliminado con éxito', life: 3000 });
      } catch (error) {
        toast.add({ severity: 'warn', summary: 'Operación fallida', detail: 'Ocurrió un error al eliminar el comentario', life: 3000 });
      }
    }
  });
};

const submitted = ref(false);
const isProcessingRequest = ref(false)
const rules = {
  comment: {
    minLength: minLength(10),
    required
  },
  rating: {
    commentRating: helpers.withMessage("Debes seleccionar una valoración", commentRating)
  }
};

const $externalResults = ref({})
const commentStructure = ref({
  comment: '',
  rating: null
});

const resetCommentForm = () => {
  commentStructure.value.comment = ""
  commentStructure.value.rating = null
}

function cancelComment() {
  resetCommentForm()
  v$.value.$reset();
  isEditing.value = false
}

const v$ = useVuelidate(rules, commentStructure, {$externalResults});

async function handleEdit() {
  isProcessingRequest.value = true
  $externalResults.value = {}
  submitted.value = true;
  v$.value.$validate();

  if (!v$.value.$error) {
    try {
      comment.value = await editComment({ gameId: comment.value.game_id, commentId: comment.value.comment_id, content: commentStructure.value.comment, rating: commentStructure.value.rating })
      isEditing.value = false
      resetCommentForm()
      v$.value.$reset();
    } catch (error) {
      $externalResults.value = error.response?.data.errors
    } finally {
      isProcessingRequest.value = false
    }
  }
  isProcessingRequest.value = false
}

</script>