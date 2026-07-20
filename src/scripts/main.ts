// ===== 深色模式切换 =====
function initDarkMode() {
  const toggle = document.getElementById('dark-mode-toggle')
  const moonIcon = document.querySelector('.dark-mode-icon-moon') as HTMLElement | null
  const sunIcon = document.querySelector('.dark-mode-icon-sun') as HTMLElement | null

  function syncIcon() {
    const isDark = document.documentElement.classList.contains('dark')
    if (moonIcon && sunIcon) {
      moonIcon.style.display = isDark ? 'none' : ''
      sunIcon.style.display = isDark ? '' : 'none'
    }
  }

  // 初次同步图标
  syncIcon()

  toggle?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark')
    if (isDark) {
      document.documentElement.classList.remove('dark')
      try { localStorage.setItem('color-mode', 'light') } catch (e) {}
    } else {
      document.documentElement.classList.add('dark')
      try { localStorage.setItem('color-mode', 'dark') } catch (e) {}
    }
    syncIcon()
  })
}

// ===== 移动端侧边栏 =====
function initSidebar() {
  const toggle = document.getElementById('top-nav-toggle')
  const sidebar = document.getElementById('sidebar-menu')
  const overlay = document.getElementById('sidebar-overlay')

  function open() {
    sidebar?.classList.add('mobile-open')
    if (overlay) overlay.style.display = ''
    sidebar?.setAttribute('data-mobile-open', 'true')
    overlay?.setAttribute('data-mobile-open', 'true')
  }

  function close() {
    sidebar?.classList.remove('mobile-open')
    if (overlay) overlay.style.display = 'none'
    sidebar?.setAttribute('data-mobile-open', 'false')
    overlay?.setAttribute('data-mobile-open', 'false')
  }

  // 默认隐藏遮罩（移动端 CSS 控制可见性，桌面端隐藏）
  if (overlay) overlay.style.display = 'none'

  toggle?.addEventListener('click', open)
  overlay?.addEventListener('click', close)

  // 子菜单展开/折叠
  const submenuToggles = document.querySelectorAll('[data-submenu-toggle]')
  submenuToggles.forEach((t) => {
    t.addEventListener('click', (e) => {
      e.preventDefault()
      const name = (t as HTMLElement).getAttribute('data-submenu-toggle')
      if (!name) return
      const submenu = document.querySelector(`[data-submenu="${CSS.escape(name)}"]`) as HTMLElement | null
      const arrow = document.querySelector(`[data-arrow="${CSS.escape(name)}"]`) as HTMLElement | null
      if (submenu) {
        const isOpen = submenu.classList.contains('submenu-open')
        submenu.classList.toggle('submenu-open')
        if (arrow) {
          arrow.style.transform = isOpen ? '' : 'rotate(180deg)'
        }
      }
    })
  })

  // 锚点滚动 + 移动端关闭侧边栏
  const anchorLinks = document.querySelectorAll('[data-anchor]')
  anchorLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const anchor = (link as HTMLElement).getAttribute('data-anchor')
      if (!anchor) return
      const el = document.getElementById(anchor)
      if (el) {
        // 当前页面存在锚点，平滑滚动
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        // 当前页面不存在锚点（如 about 页），跳转到首页对应位置
        window.location.href = `/#${anchor}`
      }
      close()
    })
  })
}

// ===== 回到顶部 =====
function initBackToTop() {
  const btn = document.getElementById('back-to-top')
  if (!btn) return

  function onScroll() {
    if (btn) btn.style.display = window.scrollY > 300 ? '' : 'none'
  }

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}

// ===== 链接卡片 URL 提示框 + Winget 安装 =====
function initLinkCard() {
  // 创建 tooltip 元素（追加到 body，等价于 Vue 的 Teleport）
  const tooltip = document.createElement('div')
  tooltip.className = 'nav-card-tooltip'
  tooltip.style.display = 'none'
  document.body.appendChild(tooltip)

  // 创建 toast 容器（等价于 Vue 的 Teleport）
  const toastOverlay = document.createElement('div')
  toastOverlay.className = 'nav-card-toast-overlay'
  toastOverlay.style.display = 'none'
  toastOverlay.innerHTML = `
    <div class="nav-card-toast">
      <button class="nav-card-toast-close" type="button">
        <i class="fas fa-times"></i>
      </button>
      <div class="nav-card-toast-header">
        <i class="fas fa-check-circle"></i>
        <span>安装命令已复制到剪贴板</span>
      </div>
      <div class="nav-card-toast-command"></div>
      <p class="nav-card-toast-hint">请在 Windows 终端中粘贴执行</p>
    </div>
  `
  document.body.appendChild(toastOverlay)

  const toastCommand = toastOverlay.querySelector('.nav-card-toast-command') as HTMLElement
  const toastClose = toastOverlay.querySelector('.nav-card-toast-close') as HTMLElement
  const toastCard = toastOverlay.querySelector('.nav-card-toast') as HTMLElement

  function showToast(command: string) {
    if (toastCommand) toastCommand.textContent = command
    toastOverlay.style.display = ''
  }

  function hideToast() {
    toastOverlay.style.display = 'none'
  }

  toastClose?.addEventListener('click', hideToast)
  toastOverlay.addEventListener('click', (e) => {
    // 仅点击遮罩（非卡片）时关闭
    if (e.target === toastOverlay) hideToast()
  })
  toastCard?.addEventListener('click', (e) => e.stopPropagation())

  // 卡片悬停显示 URL
  const cards = document.querySelectorAll('[data-nav-card]')
  cards.forEach((card) => {
    const url = (card as HTMLElement).getAttribute('data-card-url') || ''

    card.addEventListener('mouseenter', () => {
      const rect = card.getBoundingClientRect()
      tooltip.style.top = `${rect.bottom + 8}px`
      tooltip.style.left = `${rect.left + rect.width / 2}px`
      tooltip.textContent = url
      tooltip.style.display = ''
    })

    card.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none'
    })
  })

  // Winget 安装按钮
  const wingetButtons = document.querySelectorAll('[data-winget]')
  wingetButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      const wingetId = (btn as HTMLElement).getAttribute('data-winget')
      if (!wingetId) return
      const command = `winget install --id "${wingetId}"`
      const writePromise = navigator.clipboard
        ? navigator.clipboard.writeText(command)
        : Promise.reject(new Error('no clipboard'))
      writePromise.then(() => showToast(command)).catch(() => showToast(command))
    })
  })
}

// ===== 关于页站长卡片点击 =====
function initAboutPage() {
  const webmasterCard = document.querySelector('[data-webmaster-url]') as HTMLElement | null
  webmasterCard?.addEventListener('click', () => {
    const url = webmasterCard.getAttribute('data-webmaster-url')
    if (url) window.open(url, '_blank')
  })
}

// ===== 初始化 =====
function init() {
  initDarkMode()
  initSidebar()
  initBackToTop()
  initLinkCard()
  initAboutPage()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
