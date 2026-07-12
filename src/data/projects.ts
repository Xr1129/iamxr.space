export interface Project {
  title: string;
  description: string;
  url: string;
  tags: string[];
  emoji: string;
}

export const projects: Project[] = [
  {
    title: "个人网站",
    description: "我的个人网站和博客，使用 Next.js、Tailwind CSS 和 MDX 构建。支持终端模式和图形界面切换。",
    url: "https://github.com/Xr1129",
    tags: ["Next.js", "React", "Tailwind CSS", "MDX"],
    emoji: "\u{1F310}",
  },
  {
    title: "即将上线",
    description: "更多项目即将添加到这里，敬请期待！",
    url: "#",
    tags: ["即将推出"],
    emoji: "\u{1F6A7}",
  },
];
