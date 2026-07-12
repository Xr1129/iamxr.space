"use client";

import { motion } from "framer-motion";
import type { Project } from "@/data/projects";

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const Tag = project.url && project.url !== "#" ? "a" : "div";
  const tagProps = Tag === "a" ? { href: project.url, target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Tag {...tagProps} className="flex flex-col h-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-5 transition-colors hover:border-gray-400 dark:hover:border-gray-600">
        <div className="text-3xl mb-3">{project.emoji}</div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{project.title}</h3>
        <p className="mt-1.5 flex-1 text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">{project.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5 min-h-[24px]">
          {project.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center rounded-md border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">{tag}</span>
          ))}
        </div>
      </Tag>
    </motion.div>
  );
}
