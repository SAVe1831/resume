<template>
  <Navbar></Navbar>
  <div class="app">
      <router-view></router-view>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
    components: {
        Navbar
    }
}
</script>


<style>
* {
    color: #043d75;
}
body {
    background-image: url("@/images/background.jpg");
}  
</style>
