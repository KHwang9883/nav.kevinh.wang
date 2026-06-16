<template>
  <div class="page-container">
    <!-- Mobile overlay -->
    <div v-if="mobileOpen" class="sidebar-overlay" @click="mobileOpen = false"></div>
    <Sidebar
      :menu="data.menu"
      :about="data.about"
      :lastUpdate="data.lastUpdate"
      v-model:mobileOpen="mobileOpen"
    />
    <div class="main-content">
      <TopNav
        @toggle-mobile-sidebar="mobileOpen = true"
      />
      <div class="content-wrapper px-4 py-2">
        <slot />
      </div>
      <Footer :since="data.since" />
    </div>
    <BackToTop />
  </div>
</template>

<script setup lang="ts">
const mobileOpen = ref(false)
const { data: rawData } = useNavData()
const data = computed(() => rawData.value || {
  title: '',
  subtitle: '',
  favicon: '',
  banner: '',
  logo: { expanded: '', collapsed: '', dark: '' },
  menu: [],
  about: { url: '', icon: '', name: '' },
  since: 2020,
  lastUpdate: '',
})
</script>
