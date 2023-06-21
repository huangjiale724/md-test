<template>
  <div class="home">
    <span @click="linkTo('/cherry-markdown')">cherry-markdown</span>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const linkTo = (route) => {
  router.push(route)
}
</script>

<style scoped lang="scss">
.home {
  color: $theme-color;

  span {
    margin-right: 20px;
    cursor: pointer;
  }
}
</style>