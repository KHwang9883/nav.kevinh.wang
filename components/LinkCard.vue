<template>
  <div class="nav-card" ref="cardRef" @mouseenter="showTooltip" @mouseleave="hideTooltip" @click="openLink">
    <div class="nav-card-inner">
      <img
        :src="item.img"
        :alt="item.name"
        class="nav-card-img"
        @error="handleImgError"
      />
      <div class="nav-card-text">
        <a class="nav-card-name">
          {{ item.name }}
          <i v-if="item.hot" class="fas fa-fire nav-card-name-tag hot" title="特别推荐"></i>
          <i v-if="item.abandoned" class="fas fa-stop-circle nav-card-name-tag abandoned" title="近期未使用"></i>
        </a>
        <p class="nav-card-desc">{{ item.description }}</p>
      </div>
      <!-- Tags: foss/paid/affiliate/require_proxy icons + winget button -->
      <div v-if="item.foss || item.paid || item.affiliate || item.require_proxy || item.winget" class="nav-card-tags">
        <i v-if="item.foss" class="fab fa-osi nav-card-tag foss" title="自由/开源软件"></i>
        <i v-if="item.paid" class="fas fa-dollar-sign nav-card-tag paid" title="收费"></i>
        <i v-if="item.affiliate" class="fas fa-user nav-card-tag affiliate" title="本人参与"></i>
        <i v-if="item.require_proxy === 'required'" class="fas fa-plane nav-card-tag proxy-required" title="国内需借助特殊手段"></i>
        <i v-if="item.require_proxy === 'optional'" class="fas fa-plane nav-card-tag proxy-optional" title="国内可能需特殊手段"></i>
        <button v-if="item.winget" class="nav-card-winget" @click.stop="installWinget" title="使用 winget 安装">
          <i class="fas fa-download"></i>
          安装
        </button>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <div
      v-if="visible"
      class="nav-card-tooltip"
      :style="tooltipStyle"
    >{{ item.url }}</div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  item: {
    name: string
    url: string
    img: string
    description: string
    foss?: boolean
    paid?: boolean
    affiliate?: boolean
    require_proxy?: 'required' | 'optional'
    hot?: boolean
    abandoned?: boolean
    winget?: string
  }
}>()

const cardRef = ref<HTMLElement | null>(null)
const visible = ref(false)
const tooltipPosition = ref({ top: 0, left: 0 })

const tooltipStyle = computed(() => ({
  top: `${tooltipPosition.value.top}px`,
  left: `${tooltipPosition.value.left}px`
}))

function showTooltip() {
  if (!cardRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  tooltipPosition.value = {
    top: rect.bottom + 8,
    left: rect.left + rect.width / 2
  }
  visible.value = true
}

function hideTooltip() {
  visible.value = false
}

function openLink() {
  window.open(props.item.url, '_blank')
}

function installWinget() {
  if (!props.item.winget) return
  const command = `winget install --id "${props.item.winget}"`
  // Copy command to clipboard and show alert
  navigator.clipboard.writeText(command).then(() => {
    alert(`安装命令已复制到剪贴板：\n${command}\n\n请在 Windows 终端中粘贴执行。`)
  }).catch(() => {
    // Fallback for older browsers
    alert(`请在 Windows 终端中执行以下命令：\n${command}`)
  })
}

function handleImgError(e: Event) {
  const img = e.target as HTMLImageElement
  img.src = '/images/missing.png'
}
</script>

<style scoped>
.nav-card-inner {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-width: 320px;
}

.nav-card-text {
  flex: 1;
  min-width: 0;
}

.nav-card-name {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.4;
  word-break: break-word;
  overflow-wrap: break-word;
  transition: color 0.2s;
}

.nav-card-name-tag {
  margin-left: 2px;
  font-size: 0.75rem;
}

.nav-card-desc {
  font-size: 0.75rem;
  margin: 2px 0 0;
  line-height: 1.4;
  word-break: break-word;
  overflow-wrap: break-word;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.nav-card-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.nav-card-winget {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font-size: 0.8rem;
  font-weight: 500;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-card-winget i {
  font-size: 0.8rem;
}
</style>
