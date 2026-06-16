<template>
  <NuxtLayout>
    <div class="content-area">
      <template v-for="item in data.menu" :key="item.name">
        <!-- Category with submenu -->
        <template v-if="item.submenu">
          <CategorySection
            v-for="sub in item.submenu"
            :key="sub.name"
            :name="sub.name"
            :icon="sub.icon"
            :items="sub.items"
          />
        </template>
        <!-- Single category -->
        <template v-else-if="item.items">
          <CategorySection
            :name="item.name"
            :icon="item.icon"
            :items="item.items"
          />
        </template>
      </template>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const { data } = useNavData()
</script>

<style scoped>
.content-area {
  max-width: 1200px;
  margin: 16px auto;
}
</style>
