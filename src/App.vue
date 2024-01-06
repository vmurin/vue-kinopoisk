<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="header-container">
      <RouterLink to="/"><h1>KinoPoisk</h1></RouterLink>
    </div>
  </header>

  <main>
    <RouterView />
  </main>
  
</template>

<style lang="scss">

@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
@import '@/assets/base.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;

}

body {
  background-color: var(--dark-background);
}

header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 16px 30px;

  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100vw;
  }
}

a {
  text-decoration: none;
  color: white;
}


h1:hover,
a:hover {
  color: var(--search-bar-text)
}

</style>
