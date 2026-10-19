# 导航站模板

基于 Astro 7 + Tailwind CSS v4 的静态导航/书签站点模板。所有栏目与条目均由 `data/` 目录下的 YAML 文件驱动，构建产物为纯静态文件，可直接部署到任意静态托管服务。

## 特性

- **数据驱动** — 菜单结构、条目内容、关于页面全部来自 YAML / Markdown，增删内容无需改动代码
- **条目标签** — 支持开源、收费、关联、热门、已弃用、代理访问等标签，以及 winget 一键复制安装命令
- **站点外观** — 深色模式（本地持久化、无闪烁）、响应式卡片网格、移动端侧边栏、锚点导航、回到顶部

## 快速开始

```bash
bun install
bun run dev
```

常用命令：

| 命令 | 说明 |
| --- | --- |
| `bun run dev` | 启动开发服务器 |
| `bun run build` | 构建到 `dist/` |
| `bun run preview` | 预览生产构建 |
| `bun run check` | Astro 类型检查 |

## 目录结构

```
├── src/
│   ├── components/         # Astro 组件（TopNav / Sidebar / CategorySection / LinkCard / Footer / BackToTop）
│   ├── data/
│   │   ├── load.ts         # 构建时读取 YAML 并组装导航树
│   │   └── types.ts        # NavItem 等类型定义
│   ├── layouts/Layout.astro
│   ├── pages/              # index.astro（首页）、about.astro（关于页）
│   ├── scripts/main.ts     # 客户端交互（深色模式、侧边栏、锚点、winget 复制等）
│   └── styles/global.css
├── data/                   # 站点内容
│   ├── webstack.yml        # 站点元数据 + 菜单结构 + 关于页配置
│   ├── demo.yml            # 示例分类（演示全部字段）
│   ├── demoSub.yml         # 二级分组示例
│   └── about.md            # 关于页面正文
└── public/
    ├── favicon.svg         # 站点图标
    └── images/             # 条目图标（仅保留 missing.png 占位图）
```

## 改成自己的站点

1. **站点信息** — 编辑 `data/webstack.yml` 顶部的 `title`、`subtitle`、`favicon`
2. **菜单结构** — 编辑 `data/webstack.yml` 的 `menu`，每个 `config` 值对应 `data/` 下同名 YAML 文件
3. **条目内容** — 编辑或新建 `data/*.yml`，参考 `data/demo.yml` 的字段写法
4. **关于页面** — 正文写在 `data/about.md`；站长信息在 `data/webstack.yml` 的 `aboutPage.webmaster` 中配置，不需要时整段删除
5. **站点域名** — 编辑 `astro.config.mjs` 的 `site` 字段
6. **图标资源** — 条目图片放入 `public/images/`；替换 `public/favicon.svg` 为你的站点图标
7. **顶栏与页脚** — `src/components/TopNav.astro` 中的 GitHub 链接、`src/components/Footer.astro` 中的版权信息

## 数据字段

`data/*.yml` 中的每个条目对应一个 `NavItem` 对象：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `name` | string | 是 | 条目名称 |
| `url` | string | 是 | 跳转链接 |
| `img` | string | 是 | 图标。填写文件名（如 `demo.png`）会自动补全为 `/images/demo.png`；以 `/` 或 `http` 开头时按原样使用 |
| `description` | string | 是 | 一句话描述 |
| `foss` | boolean | 否 | `true` 显示 OSI 开源图标 |
| `paid` | boolean | 否 | `true` 显示美元图标（买断制收费） |
| `affiliate` | boolean | 否 | `true` 显示用户图标（与站长有直接关联） |
| `require_proxy` | `required` \| `optional` | 否 | 显示飞机图标（需代理 / 可能需代理） |
| `hot` | boolean | 否 | `true` 在名称后显示红色火焰徽章 |
| `abandoned` | boolean | 否 | `true` 在名称后显示橙色停止圆圈徽章 |
| `winget` | string | 否 | winget 包 ID（如 `Microsoft.PowerToys`），显示一键复制安装命令按钮 |

标签显示顺序：OSI → 付费 → 关联 → 代理 → winget 按钮，热门/已弃用徽章位于名称之后。

`data/webstack.yml` 的 `menu` 项结构：

```yaml
menu:
  # 顶层分类：直接指定 config
  - name: 分类名称
    icon: fas fa-star          # Font Awesome 类名
    config: demo               # 对应 data/demo.yml
  # 二级分组：通过 submenu 定义
  - name: 分组名称
    icon: fas fa-layer-group
    submenu:
      - name: 子分类名称
        icon: fas fa-cube
        config: demoSub
```

## 新增分类

1. 在 `data/` 下新建 YAML 文件（如 `myCategory.yml`），按 `NavItem` 结构填写条目
2. 在 `data/webstack.yml` 的 `menu` 中新增一项，`config` 填写文件名（不含 `.yml`）
3. 将条目图标放入 `public/images/`

## 部署

产物为纯静态文件，Cloudflare Pages、GitHub Pages、Netlify、Vercel 等均可直接托管：

- 构建命令：`bun run build`
- 输出目录：`dist/`

## 说明

- 模板不附带任何第三方软件图标，示例条目统一使用 `public/images/missing.png` 占位图（同时也是图片加载失败时的兜底图）
- 界面文本统一为简体中文；如需其他语言，修改 `data/`、`src/components/` 中的文案即可
- 配色令牌定义在 `tailwind.config.ts` 与 `src/styles/global.css`，深色模式通过 `<html class="dark">` 控制
