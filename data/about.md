本站是一个基于 [Astro](https://astro.build/) 框架 + [Tailwind CSS](https://tailwindcss.com/) 构建的静态导航站模板，所有栏目与条目均由 `data/` 目录下的 YAML 文件驱动，无需改动代码即可增删内容。

站内的条目与分类均为演示数据，请在 `data/` 目录中替换为你自己的内容。

## 标签说明

- 标有 <i class="fab fa-osi"></i> 的条目为自由/开源软件（`foss: true`）
- 标有 <i class="fas fa-fire"></i> 的条目为特别推荐的热门条目（`hot: true`）
- 标有 <i class="fas fa-dollar-sign"></i> 的条目为买断制收费软件（`paid: true`）
- 标有 <i class="fas fa-user"></i> 的条目为与站长有直接关联的项目/网站（`affiliate: true`）
- 标有 <i class="fas fa-stop-circle"></i> 的条目为近期未使用但仍作推荐（`abandoned: true`）
- 标有 <i class="fas fa-plane"></i> 的条目需借助代理等手段访问（`require_proxy: required`），<span class="proxy-optional"><i class="fas fa-plane"></i></span> 表示可能需借助代理也可能直连即可访问（`require_proxy: optional`）
- 条目卡片上的「安装」按钮（`winget` 字段）可将 `winget install` 命令一键复制到剪贴板

以上标签均由 YAML 字段开关，字段说明见 README.md 的「数据字段」章节。

## 如何贡献内容

1. 在 `data/` 目录下新建或编辑分类 YAML 文件，按 `NavItem` 结构添加条目；
2. 若为新增分类，在 `data/webstack.yml` 的 `menu` 中补充对应的 `config` 项；
3. 将条目图标放入 `public/images/`，`img` 字段只需填写文件名。
