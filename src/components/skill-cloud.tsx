"use client";

import { motion } from "framer-motion";

const skills = ["TypeScript","React","Next.js","Node.js","Tailwind CSS","Python","Docker","Git","PostgreSQL","Linux"];

export default function SkillCloud() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {skills.map((s, i) => (
        <motion.span
          key={s}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25, delay: i * 0.04 }}
          whileHover={{ y: -1 }}
          className="inline-flex cursor-default items-center rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          {s}
        </motion.span>
      ))}
    </div>
  );
}
