"use client";

import { useEffect, useState } from "react";

export function InteractiveBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Only run on client to avoid hydration mismatch
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#F0F4F8]">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E0F2F1] via-[#E3F2FD] to-[#F3E5F5] opacity-80" />

      {/* Parallax Blobs */}
      <div
        className="absolute top-[10%] left-[10%] w-96 h-96 bg-[#FF8A3D] rounded-full mix-blend-multiply blur-3xl opacity-20 transition-transform duration-100 ease-out"
        style={{
          transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
        }}
      />
      <div
        className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-[#4FC3F7] rounded-full mix-blend-multiply blur-3xl opacity-20 transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`,
        }}
      />

      {/* Floating Elements */}
      <FloatingItem
        emoji="🐕"
        top="15%"
        left="20%"
        speed={15}
        mousePos={mousePos}
      />
      <FloatingItem
        emoji="🌳"
        top="60%"
        left="10%"
        speed={10}
        mousePos={mousePos}
      />
      <FloatingItem
        emoji="☁️"
        top="20%"
        left="70%"
        speed={5}
        mousePos={mousePos}
      />
    </div>
  );
}

function FloatingItem({ emoji, top, left, speed, mousePos }: any) {
  return (
    <div
      className="absolute text-6xl select-none opacity-60 transition-transform duration-500 will-change-transform"
      style={{
        top,
        left,
        transform: `translate(${mousePos.x * speed}px, ${mousePos.y * speed}px)`,
      }}
    >
      {emoji}
    </div>
  );
}
