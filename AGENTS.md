# AGENTS.md

## 项目

基于 Nuxt 4 + Tailwind CSS 构建的导航/书签站点。通过 Nitro 预渲染生成静态站点。部署地址：https://nav.kevinh.wang/

## 命令

- **开发服务器：** `bun run dev`
- **构建：** `bun run build`
- **静态生成：** `bun run generate`
- **预览生产版本：** `bun run preview`
- **安装依赖：** `bun install`
- **Postinstall（自动）：** `nuxt prepare` — 重新生成 `.nuxt/` 类型

项目未配置 lint、test 或 typecheck 脚本。如需类型检查，手动运行 `nuxt typecheck`（未在 package.json 中配置）。

## 包管理器

Bun 1.3.14（在 `packageManager` 字段中声明）。请勿使用 npm/pnpm/yarn。

## 架构

### 目录结构

```
├── app/                    # Nuxt 应用目录
│   ├── app.vue            # 根组件
│   ├── components/        # Vue 组件
│   │   ├── BackToTop.vue
│   │   ├── CategorySection.vue
│   │   ├── Footer.vue
│   │   ├── LinkCard.vue
│   │   ├── Sidebar.vue
│   │   └── TopNav.vue
│   ├── composables/       # 组合式函数
│   │   └── useNavData.ts  # 数据获取与类型定义
│   ├── layouts/           # 布局模板
│   │   └── default.vue
│   └── pages/             # 页面路由
│       ├── index.vue
│       └── about.vue
├── assets/css/           # 全局样式
│   └── main.css
├── data/                  # YAML 数据文件
│   ├── webstack.yml      # 菜单配置与元数据
│   ├── about.md          # 关于页面内容
│   └── *.yml             # 分类数据文件
├── public/images/         # 静态图片资源
├── server/api/           # 服务端 API 路由
│   └── data.ts           # 数据组装端点
└── nuxt.config.ts        # Nuxt 配置
```

### 数据驱动的导航

所有站点内容来自 `data/` 目录下的 YAML 文件。服务端 API（`server/api/data.ts`）在请求时读取这些文件：

1. `data/webstack.yml` — 定义菜单结构、站点元数据（favicon、banner、logos）和关于页面配置。每个菜单项有一个 `config` 键，引用 YAML 文件名（不含 `.yml` 后缀）。
2. 其他 `data/*.yml` 文件 — 分类数据（如 `aiChat.yml`、`gamePlatforms.yml`）。每个文件是 `NavItem` 对象数组。
3. `data/about.md` — 关于页面的 Markdown 内容，通过 `marked` 库渲染为 HTML。

API 通过匹配 `config` 键与 YAML 文件来组装完整的导航树。要添加/重命名/重排序分类，编辑 `webstack.yml`。要添加/删除条目，编辑对应的分类 YAML 文件。

### 数据模型（`app/composables/useNavData.ts`）

```typescript
interface NavItem {
  name: string
  url: string
  img: string           // 图片文件名（如 "codex.png"），服务端自动添加 /images/ 前缀
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

`pages/index.vue`（通过 `useNavData()` 获取数据）→ `NuxtLayout` → `layouts/default.vue` → `Sidebar` + `CategorySection` → `LinkCard`。

### 图片资源

所有条目图片存放在 `public/images/` 目录。YAML 文件中的 `img` 字段只需填写文件名（如 `codex.png`），服务端 API 会自动添加 `/images/` 前缀。如需使用其他路径或外部 URL，可直接填写完整路径（以 `/` 或 `http` 开头）。

### 关于页面

Markdown 内容从 `data/about.md` 通过 `marked` 库加载。`webstack.yml` 配置 `aboutPage.website.md` 指向该 Markdown 文件，服务端 API 在构建时将其渲染为 HTML。

### 最后更新

`lastUpdate` 字段在构建时根据当前日期自动生成（格式：`YYYY-MM-DD`）。显示在侧边栏"关于本站"上方。

## 约定

- **中文界面文本** — 所有面向用户的字符串均使用简体中文。
- **深色模式** 使用 `@nuxtjs/color-mode`，采用 class 策略（Tailwind 中 `darkMode: 'class'`）。`classSuffix` 为 `''`（空），所以类名就是 `dark`。
- **配色方案** 在 `tailwind.config.ts` 的 `theme.extend.colors` 下自定义定义 — sidebar、card 和深色模式语义化令牌。请勿使用 Tailwind 默认值；使用自定义令牌。
- **字体：** Arimo（通过 `main.css` 中的 CSS `font-family` 加载，而非 Nuxt 模块）。
- **图标：** Font Awesome 7.x 通过 npm 安装（`@fortawesome/fontawesome-free`）。使用 `fab fa-*` / `fas fa-*` / `far fa-*` 类名。
- **CSS 方案：** 在 `assets/css/main.css` 中使用 `@layer components` 定义大量自定义组件类。浅色/深色模式通过 `.dark` 前缀选择器处理。模板中使用 Tailwind 工具类。
- **LinkCard 图标显示顺序：** OSI → 付费 → 联盟 → 代理 → winget 按钮。热门/已弃用图标显示在名称之后。
- **移动端侧边栏：** 使用 `transform: translateX()` 实现折叠动画，固定宽度 260px。遮罩层 z-index 为 40，菜单 z-index 为 50。

## 注意事项

- 添加新分类需要两步操作：创建 YAML 数据文件，并在 `webstack.yml` 菜单中添加 `config` 条目。
- `bun.lock` 文件已提交；`bun.lockb` 被 gitignore。使用 `bun install` 从 lockfile 恢复依赖。
- Nuxt devtools 已禁用（`devtools: { enabled: false }`）。
- 预渲染仅爬取 `/` 及其链接（`nitro.prerender` 中 `crawlLinks: true`）。
- 颜色样式必须在全局 CSS（`main.css`）中定义，而非组件的 scoped 样式，以确保深色模式兼容性。
- LinkCard 最小宽度为 320px；布局使用 CSS Grid 的 `repeat(auto-fill, minmax(320px, 1fr))`。