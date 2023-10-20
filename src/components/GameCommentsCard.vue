<template>
  <div class="card m-auto md:col-7 p-4">
    <div class="flex justify-content-between align-items-center">
      <h3 class="m-0 p-0">Comentarios</h3>
        <Button v-tooltip="tooltipButtonMessage" :disabled="isButtonBlockedToComment" icon="pi pi-comment" label="Comentar" @click="openCommentBox"/>
    </div>
    <form v-if="showCommentForm" class="my-4 card p-4" @submit.prevent="sendComment">
      <div class=" shaking-input flex align-items-center gap-2 ml-3">
        <p class="m-0 p-0 text-500">Valoración</p>
          <Rating v-model="commentStructure.rating" :cancel="false" class="m-0 p-0"/>
      </div>

      <Textarea v-model="commentStructure.comment"  class="w-full mt-3 p-2" rows="4" />
      <div class="error-container">
        <small v-if="formErrors.comment != null" class="p-error">{{ formErrors.comment }}</small>
        <small v-if="formErrors.rating != null" class="p-error">{{ formErrors.rating }}</small>
      </div>

      <div class="flex justify-content-end gap-2 mt-3">
        <Button class="cancel-button p-2" label="Cancelar" @click="cancelComment"></Button>
        <Button :loading="false" class="p-2" label="Enviar reseña" type="submit"></Button>
      </div>
    </form>

    <div v-if="!isSearchingComments">
      <UserGameComment v-for="comment in comments" :key="comment.id" :comment="comment" :deleteCommentFn="(commentId) => deleteComment(commentId)"/>
    </div>
  </div>
</template>

<script setup>
import UserGameComment from "@/components/UserGameComment.vue";
import {computed, ref} from "vue";
import {publishComment} from "@/service/GamesService";
import {useAuthStore} from "@/stores/authStore";

const authStore = useAuthStore()

const props = defineProps({
  comments: {
    type: Array,
    required: true
  },
  gameId: {
    type: Number,
    required: true
  },
  gamePublisher: {
    type: String,
    required: true
  }
});

const loggedUserUsername = authStore.getUsername

const userHasAlreadyCommented = computed(() => comments.value?.some(comment => comment.publisher.username === authStore.getUsername));

const isButtonBlockedToComment = computed(() => props.gamePublisher === loggedUserUsername || userHasAlreadyCommented.value || !authStore.isAuthenticated());

const tooltipButtonMessage = computed(() => {
  return (!authStore.isAuthenticated()) ? 'Debes iniciar sesión para comentar.' : null
});

const isSearchingComments = ref(false)

const comments = ref(props.comments);

const gameId = props.gameId;

const showCommentForm = ref(false)

const deleteComment = (commentId) => {
  comments.value = comments.value.filter(comment => comment.comment_id !== commentId)
}

const isProcessingRequest = ref(false)

const commentStructure = ref({
  comment: '',
  rating: null
});

const formErrors = ref({
  comment: null,
  rating: null,
})

const resetFormErrors = () => {
  formErrors.value.comment = null
  formErrors.value.rating = null
}

const resetCommentForm = () => {
  commentStructure.value.comment = ""
  commentStructure.value.rating = null
  resetFormErrors()
}

function openCommentBox() {
  resetCommentForm()
  showCommentForm.value = !showCommentForm.value
}

function cancelComment() {
  resetCommentForm()
  showCommentForm.value = false
}

async function sendComment() {
  isProcessingRequest.value = true

  const content = commentStructure.value.comment
  const rating = commentStructure.value.rating
  if (content == null || content.length < 10) {
    formErrors.value.comment = "Debes ingresar un comentario de al menos 10 caracteres. "
  } else {
    formErrors.value.comment = null
  }
  if (rating == null) {
    formErrors.value.rating = "Debes seleccionar una valoración. "
  } else {
    formErrors.value.rating = null
  }

  if (formErrors.value.comment == null && formErrors.value.rating == null) {
    try {
      const publishedComment = await publishComment({ gameId: gameId, content: commentStructure.value.comment, rating: commentStructure.value.rating })
      comments.value.push(publishedComment)
      isSearchingComments.value = true
      showCommentForm.value = false
      resetCommentForm()
    } catch (error) {
      console.log(error)
    } finally {
      isSearchingComments.value = false
      isProcessingRequest.value = false
    }
  }
  isProcessingRequest.value = false
}

</script>

<style scoped>

.cancel-button {
  width: 100px;
  background-color: rgba(255, 255, 255, 0.87);
  border: none;
  color: #9b2a3a;
  transition: background-color 0.3s, color 0.3s;
}

.cancel-button:hover {
  background-color: rgba(255, 255, 255, 1) !important;
  color: #FF0000 !important;
}

.p-inputtext {
  background-color: #565656;
  outline: none !important;
  border: none !important;;
  border-radius: 0;
}
</style>
