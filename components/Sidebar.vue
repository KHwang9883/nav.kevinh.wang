<template>
  <div class="sidebar-menu" :class="{ 'mobile-open': mobileOpen }">
    <div class="sidebar-inner">
      <!-- Menu -->
      <ul class="sidebar-nav">
        <li v-for="item in menu" :key="item.name" class="sidebar-nav-item">
          <!-- Has submenu -->
          <template v-if="item.submenu">
            <a class="sidebar-nav-link" @click="toggleSubmenu(item.name)">
              <i :class="item.icon" class="sidebar-nav-icon"></i>
              <span class="menu-title">{{ item.name }}</span>
              <i class="fas fa-angle-down sidebar-nav-arrow menu-title" :class="{ 'rotate-180': expandedMenus.includes(item.name) }"></i>
            </a>
            <ul v-show="expandedMenus.includes(item.name)" class="sidebar-submenu">
              <li v-for="sub in item.submenu" :key="sub.name">
                <a :href="'#' + sub.name.replace(/[\s]+/g, '-')" class="sidebar-submenu-link" @click.prevent="scrollTo(sub.name.replace(/[\s]+/g, '-'))">
                  <i :class="sub.icon" class="sidebar-nav-icon"></i>
                  <span class="menu-title">{{ sub.name }}</span>
                </a>
              </li>
            </ul>
          </template>

          <!-- Single category with anchor -->
          <template v-else-if="item.config">
            <a :href="'#' + item.name.replace(/[\s]+/g, '-')" class="sidebar-nav-link" @click.prevent="scrollTo(item.name.replace(/[\s]+/g, '-'))">
              <i :class="item.icon" class="sidebar-nav-icon"></i>
              <span class="menu-title">{{ item.name }}</span>
            </a>
          </template>

          <!-- Info item (no anchor) -->
          <template v-else>
            <a class="sidebar-nav-link sidebar-nav-link--info">
              <i :class="item.icon" class="sidebar-nav-icon"></i>
              <span class="menu-title">{{ item.name }}</span>
            </a>
          </template>
        </li>
      </ul>

      <!-- About link at bottom -->
      <div v-if="about" class="sidebar-bottom">
        <div v-if="lastUpdate" class="sidebar-last-update">
          <i class="far fa-calendar sidebar-nav-icon"></i>
          <span class="menu-title">最后更新：{{ lastUpdate }}</span>
        </div>
        <NuxtLink :to="about.url" class="sidebar-about-link">
          <i :class="about.icon" class="sidebar-nav-icon"></i>
          <span class="menu-title">{{ about.name }}</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  menu: any[]
  about: any
  lastUpdate?: string
}>()

const expandedMenus = ref<string[]>([])
const mobileOpen = defineModel<boolean>('mobileOpen', { default: false })

function toggleSubmenu(name: string) {
  const index = expandedMenus.value.indexOf(name)
  if (index === -1) {
    expandedMenus.value.push(name)
  } else {
    expandedMenus.value.splice(index, 1)
  }
}

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  mobileOpen.value = false
}
</script>

<style scoped>
.sidebar-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Navigation */
.sidebar-nav {
  list-style: none;
  padding: 12px 8px;
  margin: 0;
  flex: 1;
  overflow-y: auto;
}

.sidebar-nav-item {
  margin-bottom: 1px;
}

.sidebar-nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
}

.sidebar-nav-link--info {
  cursor: default;
  opacity: 0.6;
}

.sidebar-nav-icon {
  width: 16px;
  text-align: center;
  font-size: 13px;
  flex-shrink: 0;
}

.sidebar-nav-arrow {
  margin-left: auto;
  font-size: 11px;
  transition: transform 0.25s ease;
}

/* Submenu */
.sidebar-submenu {
  list-style: none;
  padding: 2px 0 0 0;
  margin: 0;
}

.sidebar-submenu-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 7px 12px 7px 28px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  font-size: 0.8125rem;
}

/* Bottom section */
.sidebar-bottom {
  padding: 8px 8px 16px;
}

.sidebar-last-update {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  border-radius: 8px;
  cursor: default;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
}

.sidebar-about-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
