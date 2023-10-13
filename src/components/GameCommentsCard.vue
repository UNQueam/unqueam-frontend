<template>
  <div class="card m-auto md:col-7 p-4">
    <div class="flex justify-content-between align-items-center">
      <h3 class="m-0 p-0">Comentarios</h3>
      <Button icon="pi pi-comment" label="Comentar" @click="openCommentBox"  />
    </div>
    <form v-if="showCommentForm" class="my-4 card p-4" @submit.prevent="sendComment">
      <div class=" shaking-input flex align-items-center gap-2 ml-3">
        <p class="m-0 p-0 text-500">Valoración</p>
          <Rating v-model="commentFormRating" :cancel="false" class="m-0 p-0" />
      </div>

      <Textarea v-model="comment" :class="{ 'p-invalid': submitted && v$.comment.$error }" class="w-full mt-3 p-2" rows="4" />
      <div class="error-container">
        <small v-for="error of v$.comment.$errors" :key="error.$uid" class="p-error">{{ getCustomError("comment", error.$validator, error) + ". " }}</small>
      </div>

      <div class="flex justify-content-end gap-2 mt-3">
        <Button class="cancel-button p-2" label="Cancelar" @click="cancelComment"></Button>
        <Button :loading="false" class="p-2" label="Enviar reseña" type="submit"></Button>
      </div>
    </form>

    <div>
      <UserGameComment />
      <UserGameComment />
      <UserGameComment />
    </div>
  </div>
</template>

<script setup>
import UserGameComment from "@/components/UserGameComment.vue";
import {ref} from "vue";
import {getCustomError} from "@/utils/FormErrorMessageHandler";
import {minLength, required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";

const showCommentForm = ref(false)

const comment = ref("")
const commentFormRating = ref(null)

function openCommentBox() {
  comment.value = ""
  commentFormRating.value = null
  showCommentForm.value = !showCommentForm.value
}

function cancelComment() {
  comment.value = ""
  commentFormRating.value = null
  showCommentForm.value = false
}

const submitted = ref(false);
const isProcessingRequest = ref(false)
const rules = {
  comment: {
    required,
    minLength: minLength(10),
  }
};

const $externalResults = ref({})
const commentStructure = ref({ comment: '' });
const v$ = useVuelidate(rules, commentStructure, {$externalResults});
const showErrorHintInRating = ref(false)

function sendComment() {
  if (commentFormRating.value === null) {
    showErrorHintInRating.value = true
  }

  console.log(comment.value)
    isProcessingRequest.value = true
    $externalResults.value = {}
    submitted.value = true;
    v$.value.$validate();

    if (!v$.value.$error) {
      /*try {
        const response = await authService.register(user.value)
        authStore.saveAuthenticationInfo(response.data);
        router.push('/');
      } catch (error) {
        console.log(error.response.data)
        $externalResults.value = error.response.data.errors
      } finally {
        isProcessingRequest.value = false
      }*/
    }
    //isProcessingRequest.value = false
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
