<template>
  <nav class="top-nav">
    <div class="top-nav-inner">
      <!-- Left: sidebar toggle + logo -->
      <div class="top-nav-left">
        <!-- Sidebar toggle (mobile only, hidden when showToggle is false) -->
        <button v-if="showToggle" @click="$emit('toggle-mobile-sidebar')" class="top-nav-toggle md:hidden" title="打开菜单">
          <i class="fas fa-bars"></i>
        </button>
        <!-- Text logo -->
        <NuxtLink to="/" class="top-nav-logo">
          Kevin Huang 的导航站
        </NuxtLink>
      </div>

      <!-- Right: actions -->
      <div class="top-nav-right">
        <!-- Dark mode toggle -->
        <button class="top-nav-action" @click="toggleDarkMode" title="切换主题">
          <i v-if="colorMode.value === 'dark'" class="fas fa-sun"></i>
          <i v-else class="fas fa-moon"></i>
        </button>

        <!-- GitHub link -->
        <a href="https://github.com/KHwang9883/nav.kevinh.wang" class="top-nav-action" target="_blank" title="GitHub">
          <i class="fab fa-github"></i>
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const props = withDefaults(defineProps<{
  showToggle?: boolean
}>(), {
  showToggle: true
})

defineEmits(['toggle-mobile-sidebar'])

function toggleDarkMode() {
  if (colorMode.value === 'dark') {
    colorMode.preference = 'light'
  } else {
    colorMode.preference = 'dark'
  }
}
</script>

<style scoped>
.top-nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}

.top-nav-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.top-nav-right {
  display: flex;
  align-items: center;
  gap: 2px;
}

.top-nav-toggle {
  width: 32px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
  border: none;
  font-size: 15px;
  transition: all 0.2s ease;
}

.top-nav-logo {
  font-size: 1.0625rem;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.top-nav-action {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
  border: none;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.2s ease;
}

@media (max-width: 480px) {
  .top-nav-logo {
    font-size: 0.9375rem;
  }
}
</style>
