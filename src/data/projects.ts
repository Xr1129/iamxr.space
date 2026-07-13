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
    description: "我的个人网站和博客，使用 Next.js、Tailwind CSS 和 MDX 构建，支持暗色模式和 RSS。",
    url: "https://github.com/Xr1129/iamxr.space",
    tags: ["Next.js", "React", "Tailwind CSS", "MDX"],
    emoji: "\u{1F310}",
  },
];
