<script setup>
import { RouterView } from 'vue-router'
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
</script>

<template>
  <Navbar></Navbar>
  <RouterView />
  <Footer/>
</template>

