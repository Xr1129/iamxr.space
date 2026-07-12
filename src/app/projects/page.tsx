import type { Metadata } from "next";
import ProjectCard from "@/components/project-card";
import { projects } from "@/data/projects";

export const metadata: Metadata = { title: "项目", description: "我做过的项目和作品。" };

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">项目</h1>
        <p className="text-gray-500 dark:text-gray-400">我做过的和正在做的东西。</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((p, i) => <ProjectCard key={p.title} project={p} index={i} />)}
      </div>
    </div>
  );
}
