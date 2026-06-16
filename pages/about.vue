<template>
  <div class="about-page">
    <!-- Navbar -->
    <nav class="about-navbar">
      <div class="about-navbar-inner">
        <NuxtLink to="/" class="about-logo-link">
          <span class="about-logo-text">Kevin Huang 的导航站</span>
        </NuxtLink>
        <div class="about-navbar-actions">
          <!-- Dark mode toggle -->
          <button class="about-nav-action" @click="toggleDarkMode" title="切换主题">
            <i v-if="colorMode.value === 'dark'" class="fas fa-sun"></i>
            <i v-else class="fas fa-moon"></i>
          </button>
          <!-- GitHub link -->
          <a href="https://github.com/KHwang9883/nav.kevinh.wang" class="about-nav-action" target="_blank" title="GitHub">
            <i class="fab fa-github"></i>
          </a>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <div class="about-content">
      <!-- Website info section -->
      <section v-if="aboutPage.website" class="about-section">
        <div class="about-section-header">
          <span class="about-section-icon"><i class="fas fa-info-circle"></i></span>
          <h2 class="about-section-title">{{ aboutPage.website.head }}</h2>
        </div>
        <div class="about-section-body">
          <div class="about-html" v-html="aboutPage.website.html"></div>
        </div>
      </section>

      <!-- Webmaster info section -->
      <section v-if="aboutPage.webmaster" class="about-section">
        <div class="about-section-header">
          <span class="about-section-icon"><i class="fas fa-user-circle"></i></span>
          <h2 class="about-section-title">{{ aboutPage.webmaster.head }}</h2>
        </div>
        <div class="about-section-body">
          <div class="webmaster-card" @click="openWebmasterLink">
            <div class="webmaster-avatar-wrap">
              <img :src="aboutPage.webmaster.img" :alt="aboutPage.webmaster.name" class="webmaster-avatar" />
            </div>
            <div class="webmaster-info">
              <h3 class="webmaster-name">{{ aboutPage.webmaster.name }}</h3>
              <p class="webmaster-desc">{{ aboutPage.webmaster.description }}</p>
              <span class="webmaster-link">
                <i class="fas fa-external-link-alt"></i> 访问主页
              </span>
            </div>
          </div>
          <div v-if="aboutPage.webmaster.html" class="about-html mt-6" v-html="aboutPage.webmaster.html"></div>
        </div>
      </section>
    </div>

    <!-- Footer -->
    <Footer :since="since" />
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const { data: rawData } = useNavData()
const data = computed(() => rawData.value!)

const aboutPage = computed(() => data.value?.aboutPage || { website: { head: '', html: '' }, webmaster: { head: '', name: '', url: '', img: '', description: '', html: '' } })
const since = computed(() => data.value?.since || 2020)

function toggleDarkMode() {
  if (colorMode.value === 'dark') {
    colorMode.preference = 'light'
  } else {
    colorMode.preference = 'dark'
  }
}

function openWebmasterLink() {
  if (aboutPage.value.webmaster?.url) {
    window.open(aboutPage.value.webmaster.url, '_blank')
  }
}
</script>

<style scoped>
/* Navbar */
.about-navbar {
  position: sticky;
  top: 0;
  z-index: 30;
}

.about-navbar-inner {
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.about-navbar-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.about-nav-action {
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

.about-logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.about-logo-text {
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

/* Page layout */
.about-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.about-content {
  flex: 1;
  width: 960px;
  margin: 0 auto;
  padding: 40px 24px 60px;
}

/* Section */
.about-section {
  margin-bottom: 40px;
  border-radius: 12px;
  overflow: hidden;
}

.about-section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 24px;
}

.about-section-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  font-size: 14px;
  flex-shrink: 0;
}

.about-section-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.about-section-body {
  padding: 24px;
}

/* About HTML content */
.about-html {
  line-height: 1.8;
  font-size: 0.9375rem;
}

.about-html :deep(blockquote) {
  border-left: 4px solid;
  padding: 16px 20px;
  margin: 0;
  border-radius: 0 8px 8px 0;
}

.about-html :deep(p) {
  margin: 0 0 12px;
}

.about-html :deep(p:last-child) {
  margin-bottom: 0;
}

.about-html :deep(a) {
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

.about-html :deep(a:hover) {
  border-bottom-color: inherit;
}

.about-html :deep(ul) {
  list-style-type: disc;
  padding-left: 1.5em;
  margin: 0 0 12px;
}

.about-html :deep(ul:last-child) {
  margin-bottom: 0;
}

.about-html :deep(li) {
  margin: 0.25em 0;
}

/* Webmaster card */
.webmaster-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid transparent;
}

.webmaster-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.12);
}

.webmaster-avatar-wrap {
  flex-shrink: 0;
}

.webmaster-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.webmaster-info {
  flex: 1;
  min-width: 0;
}

.webmaster-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 4px;
}

.webmaster-desc {
  font-size: 0.875rem;
  margin: 0 0 8px;
}

.webmaster-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8125rem;
  font-weight: 500;
}

.webmaster-link i {
  font-size: 10px;
}

/* Responsive */
@media (max-width: 768px) {
  .about-content {
    padding: 28px 20px 48px;
  }
}

@media (max-width: 480px) {
  .about-navbar-inner {
    padding: 0 16px;
    height: 56px;
  }

  .about-logo-text {
    font-size: 1rem;
  }

  .about-content {
    padding: 20px 12px 40px;
  }

  .about-section-header {
    padding: 16px 18px;
  }

  .about-section-title {
    font-size: 1rem;
  }

  .about-section-body {
    padding: 16px 18px;
  }

  .about-html {
    font-size: 0.875rem;
  }

  .webmaster-card {
    padding: 16px;
    gap: 14px;
  }

  .webmaster-avatar {
    width: 52px;
    height: 52px;
  }

  .webmaster-name {
    font-size: 1rem;
  }
}
</style>
