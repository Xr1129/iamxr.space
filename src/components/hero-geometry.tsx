"use client";

import { motion } from "framer-motion";

export default function HeroGeometry() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {/* dot grid */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* large ring — slow rotation */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute -top-1/4 -right-1/4 w-[55%] aspect-square rounded-full border border-gray-300 dark:border-gray-700 opacity-[0.12]"
      />

      {/* medium ring — counter-rotate + float */}
      <motion.div
        animate={{ rotate: -360, y: [0, 16, 0] }}
        transition={{
          rotate: { duration: 45, repeat: Infinity, ease: "linear" },
          y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute top-1/3 -left-1/6 w-[38%] aspect-square rounded-full border border-gray-300 dark:border-gray-700 opacity-[0.10]"
      />

      {/* small gradient blob — gentle float */}
      <motion.div
        animate={{ y: [0, -24, 0], x: [0, 12, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/5 w-28 h-28 rounded-full bg-gradient-to-br from-blue-500/[0.06] to-purple-500/[0.06] dark:from-blue-400/[0.05] dark:to-purple-400/[0.05]"
      />

      {/* diagonal line 1 */}
      <motion.div
        animate={{ rotate: [44, 46, 44] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-1/2 -left-1/2 w-[200%] h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent opacity-[0.12] origin-center"
      />

      {/* diagonal line 2 */}
      <motion.div
        animate={{ rotate: [-44, -42, -44] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-1/2 -left-1/2 w-[200%] h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent opacity-[0.08] origin-center"
      />
    </div>
  );
}
