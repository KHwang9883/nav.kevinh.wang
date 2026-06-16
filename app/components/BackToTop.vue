<template>
  <div class="back-to-top" @click="scrollToTop" title="回到顶部">
    <i class="fas fa-arrow-up"></i>
  </div>
</template>

<script setup lang="ts">
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.back-to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  z-index: 50;
}

@media (max-width: 640px) {
  .back-to-top {
    right: 16px;
    bottom: 16px;
    width: 36px;
    height: 36px;
  }
}
</style>