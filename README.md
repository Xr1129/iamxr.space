# Xr-Space

<p align="center">
  <strong>个人网站与博客 · Personal Website & Blog</strong>
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

## 特性 / Features

- **MDX 博客** — 使用 MDX 编写文章，支持 Markdown + JSX 组件
- **手机端编辑** — PWA 安装到手机桌面，随时随地编写和发布
- **Markdown 工具栏** — 底部格式化工具栏 + `/` 斜杠命令 + 选中菜单
- **图片上传** — 手机拍照直接上传，自动插入 Markdown 语法
- **暗色模式** — 跟随系统偏好，支持手动切换
- **博客搜索** — 客户端实时搜索文章
- **评论系统** — 基于 Giscus 的 GitHub Discussions 评论
- **留言墙** — 访客留言，JSON 文件存储
- **RSS 订阅** — 自动生成 RSS Feed
- **站点地图** — 自动生成 sitemap.xml
- **响应式设计** — 适配桌面端与移动端
- **Framer Motion** — 精致的页面动效
- **代码高亮** — rehype-highlight 语法高亮
- **PWA 支持** — 可安装为桌面/手机应用，离线访问

## 技术栈 / Tech Stack

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router + Turbopack) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS 4 |
| 动效 | Framer Motion |
| 内容 | MDX + gray-matter + next-mdx-remote |
| 代码高亮 | rehype-highlight |
| 评论 | Giscus |
| 部署 | 自托管 (Linux + Nginx + systemd) |

## 项目结构 / Project Structure

```
iamxr.space/
├── content/posts/              # MDX 博客文章
├── data/
│   ├── guestbook.json          # 留言数据
│   └── images/posts/          # 上传的图片（服务端，不入 git）
├── public/
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service Worker
│   └── images/                 # 静态图片
├── scripts/
│   └── upload-image.sh         # 旧版 SCP 上传脚本
├── src/
│   ├── app/
│   │   ├── page.tsx            # 首页
│   │   ├── layout.tsx          # 根布局
│   │   ├── globals.css         # 全局样式
│   │   ├── about/              # 关于页
│   │   ├── blog/
│   │   │   ├── page.tsx        # 博客列表
│   │   │   ├── [slug]/page.tsx # 文章详情
│   │   │   └── rss.xml/       # RSS 接口
│   │   ├── projects/           # 项目展示
│   │   ├── guestbook/           # 留言墙
│   │   ├── sitemap.xml/        # 站点地图
│   │   ├── login/              # 编辑器登录页
│   │   ├── (editor)/editor/   # 编辑器页面组
│   │   │   ├── page.tsx        # 仪表盘
│   │   │   ├── new/            # 新建帖子
│   │   │   └── [slug]/         # 编辑帖子
│   │   ├── api/                # API 路由
│   │   │   ├── auth/           # 登录/登出
│   │   │   ├── posts/          # 帖子 CRUD
│   │   │   ├── upload/         # 图片上传
│   │   │   └── preview/        # MDX 预览
│   │   └── uploads/images/posts/ # 动态图片服务
│   ├── components/
│   │   ├── gui-home.tsx        # 首页组件
│   │   ├── hero-geometry.tsx   # 首页动画背景
│   │   ├── header.tsx          # 导航栏
│   │   ├── footer.tsx          # 页脚
│   │   ├── blog-search.tsx     # 博客搜索
│   │   ├── comments.tsx        # Giscus 评论
│   │   ├── project-card.tsx    # 项目卡片
│   │   ├── mdx-image.tsx       # MDX 图片组件
│   │   ├── guestbook-wall.tsx   # 留言墙组件
│   │   └── editor/             # 编辑器组件
│   │       ├── post-form.tsx   # 帖子表单
│   │       ├── mdx-editor.tsx  # MDX 编辑器（工具栏+斜杠命令）
│   │       ├── markdown-toolbar.tsx  # 底部格式化工具栏
│   │       ├── slash-commands.tsx    # / 命令面板
│   │       ├── preview-panel.tsx     # MDX 预览
│   │       └── delete-button.tsx     # 删除按钮
│   ├── data/projects.ts        # 项目数据
│   └── lib/
│       ├── posts.ts            # 文章读取与写入
│       ├── auth.ts             # 认证（HMAC token）
│       └── editor-utils.ts     # 编辑器工具函数
├── next.config.js
├── tsconfig.json
├── package.json
└── .env.local                  # 环境变量（不入 git）
```

## 本地开发 / Getting Started

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装与运行

```bash
git clone https://github.com/Xr1129/iamxr.space.git
cd iamxr.space
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

### 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm start` | 启动生产服务器 |
| `npm run lint` | ESLint 检查 |

## 编写博客 / Writing Posts

### 方式一：手机端编辑器（推荐）

1. 浏览器访问 `https://iamxr.space/login`
2. 输入密码进入编辑器
3. 新建/编辑帖子，支持：
   - **底部工具栏**：粗体、斜体、标题、链接、图片、代码等
   - **斜杠命令**：输入 `/` 弹出命令菜单
   - **选中菜单**：选中文字后弹出格式化浮动条
   - **图片上传**：点击 📷 按钮直接拍照或选图上传
4. 保存后即时生效，无需 rebuild

> 手机上可将网站添加到主屏幕，获得类原生 App 体验。

### 方式二：直接编写 MDX 文件

在 `content/posts/` 目录下创建 `.mdx` 文件：

```mdx
---
title: "文章标题"
date: "2026-07-13 14:30"
excerpt: "文章摘要。"
---

## 正文

在这里写 Markdown 内容。

![图片](/uploads/images/posts/slug/photo.jpg)
```

## 环境变量 / Environment Variables

复制 `.env.local` 到服务器并配置：

```
EDITOR_PASSWORD=你的密码
AUTH_SECRET=<openssl rand -hex 32 生成>
```

## 部署 / Deployment

```bash
# 生产服务器上
cd /var/www/iamxr.space
git pull
npm install
npm run build
systemctl restart iamxr.space
```

Nginx 配置：

```nginx
server {
    listen 443 ssl;
    server_name iamxr.space;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 50M;  # 支持图片上传
    }
}
```

## 许可证 / License

[MIT](./LICENSE) © Xr
