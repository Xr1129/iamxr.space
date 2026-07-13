# Xr—Space

<p align="center">
  <strong>🚀 我的个人网站与博客 · Personal Website & Blog</strong>
</p>

<p align="center">
  <a href="https://iamxr.space"><strong>iamxr.space</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
</p>

---

## ✨ 特性 / Features

- 🖥️ **双模式体验** — 终端模式 + 图形界面，一键切换
- 📝 **MDX 博客** — 使用 MDX 编写文章，支持 Markdown + JSX 组件
- 🌓 **暗色模式** — 跟随系统偏好，支持手动切换
- 🔍 **博客搜索** — 客户端实时搜索文章
- 🏷️ **标签系统** — 按标签筛选博客文章
- 💬 **评论系统** — 基于 [Giscus](https://giscus.app/) 的 GitHub Discussions 评论
- 📡 **RSS 订阅** — 自动生成 RSS Feed
- 🗺️ **站点地图** — 自动生成 sitemap.xml
- 📱 **响应式设计** — 适配桌面端与移动端
- ⚡ **Framer Motion** — 精致的页面动效
- 🎨 **代码高亮** — rehype-highlight 语法高亮
- 🔧 **PWA 支持** — 可安装为桌面应用

## 🛠️ 技术栈 / Tech Stack

| 类别 | 技术 |
|------|------|
| 框架 | [Next.js 16](https://nextjs.org/) (App Router) |
| 语言 | [TypeScript](https://www.typescriptlang.org/) |
| 样式 | [Tailwind CSS 4](https://tailwindcss.com/) |
| 动效 | [Framer Motion](https://www.framer.com/motion/) |
| 内容 | [MDX](https://mdxjs.com/) + [gray-matter](https://github.com/jonschlinkert/gray-matter) |
| 代码高亮 | [rehype-highlight](https://github.com/rehypejs/rehype-highlight) |
| 评论 | [Giscus](https://giscus.app/) |
| 部署 | 自托管 (Linux + Nginx + systemd) |

## 📁 项目结构 / Project Structure

```
iamxr.space/
├── content/
│   └── posts/             # MDX 博客文章
├── public/
│   ├── manifest.json      # PWA manifest
│   └── robots.txt         # SEO robots
├── src/
│   ├── app/               # Next.js App Router 页面
│   │   ├── about/         # 关于页
│   │   ├── blog/          # 博客列表 & [slug] 动态路由
│   │   │   ├── rss.xml/   # RSS 接口
│   │   │   └── tag/       # 标签筛选
│   │   ├── projects/      # 项目展示
│   │   └── sitemap.xml/   # 站点地图
│   ├── components/        # React 组件
│   │   ├── terminal.tsx   # 终端模拟器
│   │   ├── gui-home.tsx   # GUI 首页
│   │   ├── file-tree.tsx  # 文件树侧栏
│   │   ├── blog-preview.tsx
│   │   ├── blog-search.tsx
│   │   ├── comments.tsx   # Giscus 评论
│   │   ├── header.tsx / footer.tsx
│   │   ├── hero-background.tsx
│   │   ├── home-client.tsx  # 首页模式切换
│   │   ├── project-card.tsx
│   │   ├── skill-cloud.tsx
│   │   └── typewriter.tsx
│   ├── data/
│   │   └── projects.ts    # 项目数据
│   └── lib/
│       └── posts.ts       # 文章解析 & 查询
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🚀 本地开发 / Getting Started

### 环境要求

- **Node.js** >= 18
- **npm** >= 9

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/Xr1129/iamxr.space.git
cd iamxr.space

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

### 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（热更新） |
| `npm run build` | 构建生产版本 |
| `npm start` | 启动生产服务器 |
| `npm run lint` | 运行 ESLint 检查 |

## 📝 编写博客 / Writing Posts

在 `content/posts/` 目录下创建 `.mdx` 文件：

```mdx
---
title: "文章标题"
date: "2026-07-13"
excerpt: "文章摘要，用于列表展示和 RSS。"
tags: ["Next.js", "React", "TypeScript"]
---

## 正文开始

在这里写 Markdown 内容，支持代码块、图片等。

```typescript
// 代码高亮自动生效
const greeting: string = "Hello, World!";
```
```

保存后刷新页面即可看到新文章。

## 📦 部署 / Deployment

本项目部署在 Linux 服务器上，使用 Nginx 反向代理 + systemd 进程管理。

```bash
# 在生产服务器上
cd /var/www/iamxr.space
git pull
npm install
npm run build
systemctl restart iamxr.space
```

Nginx 配置示例：

```nginx
server {
    listen 80;
    server_name iamxr.space;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📄 许可证 / License

[MIT](./LICENSE) © Xr

---

<p align="center">
  <sub>Built with ❤️ using Next.js, TypeScript, and Tailwind CSS</sub>
</p>
