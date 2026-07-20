# AGENTS.md

## 项目

基于 Astro 7 + Tailwind CSS v4 构建的导航/书签站点。通过 Astro 静态生成（`output: 'static'`）产出纯静态文件。部署地址：https://nav.kevinh.wang/

## 命令

- **开发服务器：** `bun run dev`（`astro dev --host`）
- **构建：** `bun run build`（`astro build`，输出至 `dist/`）
- **预览生产版本：** `bun run preview`（`astro preview`）
- **类型检查：** `bun run check`（`astro check`）
- **安装依赖：** `bun install`

项目未配置 lint 或 test 脚本。

## 包管理器

Bun 1.3.14（在 `packageManager` 字段中声明）。请勿使用 npm/pnpm/yarn。

## 架构

### 目录结构

```
├── src/                    # Astro 应用源码
│   ├── components/         # Astro 组件
│   │   ├── BackToTop.astro
│   │   ├── CategorySection.astro
│   │   ├── Footer.astro
│   │   ├── LinkCard.astro
│   │   ├── Sidebar.astro
│   │   └── TopNav.astro
│   ├── data/               # 构建时数据加载
│   │   ├── load.ts         # YAML 读取与导航树组装
│   │   └── types.ts        # 类型定义
│   ├── layouts/            # 布局模板
│   │   └── Layout.astro
│   ├── pages/              # 页面路由
│   │   ├── index.astro
│   │   └── about.astro
│   ├── scripts/            # 客户端脚本
│   │   └── main.ts         # 所有交互逻辑（深色模式、侧边栏、tooltip 等）
│   └── styles/             # 全局样式
│       └── global.css
├── data/                   # YAML 数据文件
│   ├── webstack.yml        # 菜单配置与元数据
│   ├── about.md            # 关于页面内容
│   └── *.yml               # 分类数据文件
├── public/                 # 静态资源
│   ├── images/             # 条目图片
│   └── favicon.ico
├── astro.config.mjs        # Astro 配置（集成 @tailwindcss/vite）
├── tailwind.config.ts      # Tailwind 配置（自定义颜色令牌）
└── tsconfig.json           # TypeScript 配置（继承 astro/tsconfigs/strict）
```

### 数据驱动的导航

所有站点内容来自 `data/` 目录下的 YAML 文件。构建时数据加载模块（`src/data/load.ts`）在 Astro 构建时读取这些文件并组装完整的导航树：

1. `data/webstack.yml` — 定义菜单结构、站点元数据（favicon、banner、logos）和关于页面配置。每个菜单项有一个 `config` 键，引用 YAML 文件名（不含 `.yml` 后缀）。
2. 其他 `data/*.yml` 文件 — 分类数据（如 `aiChat.yml`、`gamePlatforms.yml`）。每个文件是 `NavItem` 对象数组。
3. `data/about.md` — 关于页面的 Markdown 内容，通过 `marked` 库渲染为 HTML。

`getNavData()` 函数通过匹配 `config` 键与 YAML 文件来组装完整的导航树。要添加/重命名/重排序分类，编辑 `webstack.yml`。要添加/删除条目，编辑对应的分类 YAML 文件。

### 数据模型（`src/data/types.ts`）

```typescript
interface NavItem {
  name: string
  url: string
  img: string           // 图片文件名（如 "codex.png"），构建时自动添加 /images/ 前缀
  description: string
  foss?: boolean        // 免费/开源标签（OSI 图标）
  paid?: boolean        // 付费标签（美元图标）
  affiliate?: boolean   // 关联链接标签（用户图标）
  require_proxy?: 'required' | 'optional'  // 代理指示器（飞机图标）
  hot?: boolean         // 名称旁的热门徽章（火焰图标，红色）
  abandoned?: boolean   // 名称旁的已弃用徽章（停止圆圈图标，橙色）
  winget?: string       // Windows winget 包 ID（如 "ZhipuAI.ChatGLM"）
}
```

### 组件流程

`pages/index.astro`（通过 `getNavData()` 获取数据）→ `Layout.astro` → `Sidebar` + `CategorySection` → `LinkCard`。

### 图片资源

所有条目图片存放在 `public/images/` 目录。YAML 文件中的 `img` 字段只需填写文件名（如 `codex.png`），`src/data/load.ts` 会自动添加 `/images/` 前缀。如需使用其他路径或外部 URL，可直接填写完整路径（以 `/` 或 `http` 开头）。

### 关于页面

Markdown 内容从 `data/about.md` 通过 `marked` 库加载。`webstack.yml` 配置 `aboutPage.website.md` 指向该 Markdown 文件，`src/data/load.ts` 在构建时将其渲染为 HTML。

### 最后更新

`lastUpdate` 字段在构建时根据当前日期自动生成（格式：`YYYY-MM-DD`）。显示在侧边栏"关于本站"上方。

## 约定

- **中文界面文本** — 所有面向用户的字符串均使用简体中文。
- **深色模式** — 自定义实现，通过 `<html>` 元素的 `class="dark"` 控制。状态持久化到 `localStorage`（key: `color-mode`）。`Layout.astro` 中有内联脚本防止页面加载时闪烁。Tailwind v4 中通过 `@custom-variant dark (&:where(.dark, .dark *))` 声明 class 策略。
- **配色方案** 在 `tailwind.config.ts` 的 `theme.extend.colors` 下自定义定义 — sidebar、card 和深色模式语义化令牌。请勿使用 Tailwind 默认值；使用自定义令牌。
- **字体：** 跨平台系统字体栈（`system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif`），在 `global.css` 的 `body` 中声明。不加载外部字体文件。
- **图标：** Font Awesome 7.x 通过 npm 安装（`@fortawesome/fontawesome-free`），在 `Layout.astro` 中通过 `import '@fortawesome/fontawesome-free/css/all.min.css'` 全局导入。使用 `fab fa-*` / `fas fa-*` / `far fa-*` 类名。
- **CSS 方案：** 在 `src/styles/global.css` 中使用 `@layer components` 定义大量自定义组件类。浅色/深色模式通过 `.dark` 前缀选择器处理。模板中使用 Tailwind 工具类。Tailwind v4 通过 `@tailwindcss/vite` 插件集成，CSS 中使用 `@import "tailwindcss"` + `@config "../../tailwind.config.ts"` 引用传统配置。
- **LinkCard 图标显示顺序：** OSI → 付费 → 联盟 → 代理 → winget 按钮。热门/已弃用图标显示在名称之后。
- **移动端侧边栏：** 使用 `transform: translateX()` 实现折叠动画，固定宽度 260px。遮罩层 z-index 为 40，菜单 z-index 为 50。
- **侧边栏子菜单动画：** 使用 `max-height` + `opacity` + `transition` 实现淡入淡出展开/折叠效果（0.25s ease），通过 `classList.toggle('submenu-open')` 控制。
- **锚点滚动：** 分类锚点容器使用 `scroll-margin-top: 72px` 补偿固定 topnav（56px）高度，避免标题被遮挡。在非首页（如 about 页）点击侧边栏锚点会跳转到 `/#锚点`。

## 注意事项

- 添加新分类需要两步操作：创建 YAML 数据文件，并在 `webstack.yml` 菜单中添加 `config` 条目。
- `bun.lock` 文件已提交；`bun.lockb` 被 gitignore。使用 `bun install` 从 lockfile 恢复依赖。
- Cloudflare Pages 构建命令使用 `bun run build`（即 `astro build`），输出目录为 `dist/`。产物为纯静态文件，无需 Node.js 运行时。
- 颜色样式必须在全局 CSS（`src/styles/global.css`）中定义，而非组件的 scoped 样式，以确保深色模式兼容性。
- LinkCard 内部最小宽度为 320px；卡片网格使用 CSS Grid 的 `repeat(auto-fill, minmax(360px, 1fr))`。
- 客户端交互逻辑统一在 `src/scripts/main.ts` 中实现，通过 `Layout.astro` 的 `<script>` 标签导入。Tooltip 和 Toast 元素由 JS 动态创建并追加到 `<body>`（等价于 Vue 的 Teleport）。
