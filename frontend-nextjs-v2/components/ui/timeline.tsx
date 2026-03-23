"use client";
import { useScroll, useTransform, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry { title: string; content: React.ReactNode; }

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (ref.current) {
      const { height } = ref.current.getBoundingClientRect();
      setHeight(height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start 10%", "end 50%"] });
  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full bg-transparent font-sans md:px-10" ref={containerRef}>
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 lg:px-10">
        <h2 className="mb-4 max-w-4xl text-left text-2xl font-bold text-white md:text-4xl">
          Log de Desenvolvimento
        </h2>
        <p className="max-w-sm text-left text-sm text-[#9CA3AF] md:text-base">
          Acompanhe cada fase do projeto Smart Greenhouse, do planejamento ao deploy.
        </p>
      </div>
      <div ref={ref} className="relative mx-auto max-w-7xl pb-20">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start gap-10 pt-10 md:gap-10">
            <div className="sticky top-40 z-40 flex max-h-fit w-full max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#0a0a0a] border border-[#58D68D]/30 md:left-3">
                <div className="h-4 w-4 rounded-full bg-[#58D68D]/20 border border-[#58D68D]/50 p-2" />
              </div>
              <h3 className="hidden text-xl font-bold text-[#58D68D] md:block md:pl-20 md:text-4xl">
                {item.title}
              </h3>
            </div>
            <div className="relative w-full pr-4 md:pl-4">
              <h3 className="mb-4 block text-left text-2xl font-bold text-[#58D68D] md:hidden">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{ height: height + "px" }}
          className="absolute left-8 top-0 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-0% via-[#58D68D]/20 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] md:left-8"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-[#58D68D] from-0% via-[#1E8449] to-transparent to-[99%]"
          />
        </div>
      </div>
    </div>
  );
};
