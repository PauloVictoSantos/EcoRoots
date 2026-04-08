"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed left-0 top-0 z-50 h-0.75"
      style={{
        width: `${progress}%`,
        background: "linear-gradient(90deg, var(--amazon-dark), var(--amazon-highlight))",
        boxShadow: "0 0 10px var(--amazon-glow)",
        transition: "width 0.1s linear",
      }}
    />
  );
}
