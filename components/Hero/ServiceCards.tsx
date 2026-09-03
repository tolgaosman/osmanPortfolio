"use client";

import { motion } from "framer-motion";
import { Globe, Smartphone, Database, type LucideIcon } from "lucide-react";
import { heroServices } from "@/data/services";
import { useLang } from "@/lib/i18n";
import type { ServiceId } from "@/types";

const ICONS: Record<ServiceId, LucideIcon> = {
  web: Globe,
  mobile: Smartphone,
  backend: Database,
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.55 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function ServiceCards() {
  const { t } = useLang();
  const titles = t.hero.services;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3"
    >
      {heroServices.map((service) => {
        const Icon = ICONS[service.id];
        return (
          <motion.div
            key={service.id}
            variants={item}
            whileHover={{ y: -4, x: -4 }}
            className="border-2 border-border bg-surface p-5 text-left transition-shadow duration-200 hover:shadow-neo-border"
          >
            <Icon className="h-5 w-5 text-accent" aria-hidden />
            <h3 className="mt-3 font-mono text-sm font-bold text-text">
              {titles[service.id]}
            </h3>
            <p className="mt-1.5 font-mono text-xs text-muted">
              {service.stack.join(" · ")}
            </p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
