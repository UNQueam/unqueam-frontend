<script setup>
import { RouterView } from 'vue-router'
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
</script>

<template>
  <div class="flex flex-column h-full justify-content-between">
    <div>
      <Navbar></Navbar>
      <RouterView />
    </div>
    <div>
      <Footer/>
    </div>
  </div>


</template>

