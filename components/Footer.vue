<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-left">
        <span class="footer-copyright">&copy; {{ sinceRange }}</span>
        <a href="https://kevinh.wang/" class="footer-author" target="_blank">Kevin Huang</a>
        <span class="footer-divider">|</span>
        <span class="footer-credit">Powered by <a href="https://nuxt.com/" target="_blank">Nuxt</a></span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const props = defineProps<{
  since: number
}>()

const currentYear = new Date().getFullYear()
const sinceRange = props.since === currentYear ? String(props.since) : `${props.since} - ${currentYear}`
</script>

<style scoped>
.footer-inner {
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  flex-wrap: wrap;
}

.footer-author {
  text-decoration: none;
  transition: color 0.2s;
}

.footer-divider {
  margin: 0 2px;
}

.footer-credit a {
  text-decoration: none;
  transition: color 0.2s;
}

@media (max-width: 640px) {
  .footer-inner {
    padding: 14px 16px;
  }

  .footer-left {
    font-size: 0.75rem;
  }
}
</style>
