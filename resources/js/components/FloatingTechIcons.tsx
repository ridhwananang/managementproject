// src/components/FloatingTechIcons.tsx
import React from "react";
import { motion } from "framer-motion";
import {
  SiReact,
  SiTailwindcss,
  SiLaravel,
  SiMysql,
  SiPhpmyadmin,
  SiFigma,
  SiJavascript,
  SiTypescript,
  SiNodedotjs,
} from "@icons-pack/react-simple-icons";

const icons = [
  { Icon: SiReact, color: "#61DAFB", x: "10%", y: "20%", delay: 0.2 },
  { Icon: SiTailwindcss, color: "#38BDF8", x: "30%", y: "70%", delay: 1.1 },
  { Icon: SiLaravel, color: "#FF2D20", x: "65%", y: "25%", delay: 0.5 },
  { Icon: SiMysql, color: "#4479A1", x: "80%", y: "55%", delay: 1.6 },
  { Icon: SiPhpmyadmin, color: "#6C7EB7", x: "15%", y: "60%", delay: 1.8 },
  { Icon: SiFigma, color: "#F24E1E", x: "55%", y: "80%", delay: 0.7 },
  { Icon: SiJavascript, color: "#F7DF1E", x: "75%", y: "15%", delay: 1.3 },
  { Icon: SiTypescript, color: "#3178C6", x: "45%", y: "35%", delay: 1.9 },
  { Icon: SiNodedotjs, color: "#3C873A", x: "20%", y: "10%", delay: 0.9 },
];

export default function FloatingTechIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Layer Pertama (Posisi tetap) */}
      {icons.map(({ Icon, color, x, y, delay }, i) => (
        <motion.div
          key={`fixed-${i}`}
          className="absolute opacity-70 transition-opacity duration-500"
          style={{ left: x, top: y }}
          initial={{ y: 0, scale: 0.8, opacity: 0 }}
          animate={{
            y: [0, -20, 0],
            scale: [0.9, 1.05, 0.9],
            opacity: [0.2, 0.6, 0.2],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            delay,
            duration: 8 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Icon size={48} color={color} />
        </motion.div>
      ))}

      {/* Layer Kedua (Posisi acak) */}
      {icons.map(({ Icon, color }, i) => {
        const randomX = `${Math.random() * 90}%`;
        const randomY = `${Math.random() * 80}%`;
        const randomDelay = Math.random() * 2;
        const randomSize = 36 + Math.random() * 12;

        return (
          <motion.div
            key={`random-${i}`}
            className="absolute opacity-40 transition-opacity duration-500"
            style={{ left: randomX, top: randomY }}
            initial={{ y: 0, scale: 0.7, opacity: 0 }}
            animate={{
              y: [0, -25, 0],
              scale: [0.8, 1.1, 0.8],
              opacity: [0.15, 0.4, 0.15],
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              delay: randomDelay,
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon size={randomSize} color={color} />
          </motion.div>
        );
      })}
    </div>
  );
}
