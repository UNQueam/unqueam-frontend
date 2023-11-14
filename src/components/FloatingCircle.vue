<template>
  <div class="floating-circle" @click="handleClick">
    <img src="../assets/icons/coffee-cup.svg" alt="Cafecito" />
  </div>
</template>

<script setup>
const handleClick = () => {
  console.log('Círculo clicado');
};
</script>
rgb(255, 129, 63)
<style scoped>

.floating-circle {
  position: fixed;
  bottom: 60px;
  right: 60px;
  width: 80px;
  height: 80px;
  background-color: rgb(255, 129, 63);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.floating-circle:hover {
  transform: scale(1.1);
}

.floating-circle img {
  width: 50%;
  height: auto;
  overflow: hidden;
}

@media (max-width: 767px) {
  .floating-circle {
    position: static;
    margin-top: 20px;
    margin-right: 20px;
    width: 60px;
    height: 60px;
  }
}

</style>
