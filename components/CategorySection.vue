<template>
  <div :id="anchorId">
    <h4 class="category-title">
      <i :class="icon" style="margin-right: 7px;"></i>
      <span>{{ name }}</span>
    </h4>
    <div class="nav-grid">
      <LinkCard v-for="item in items" :key="item.name" :item="item" />
    </div>
    <div class="mb-6"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
  icon: string
  items: any[]
}>()

const anchorId = computed(() => props.name.replace(/\s+/g, '-'))
</script>

<style scoped>
.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 10px;
}
</style>
