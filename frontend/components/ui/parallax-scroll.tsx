"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export const ParallaxScroll = ({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start end", "end start"],
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translatefourth = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const third = Math.ceil(images.length / 3);

  const firstPart = images.slice(0, third);
  const secondPart = images.slice(third, 2 * third);
  const thirdPart = images.slice(third, 2 * third);
  const fourthPart = images.slice(2 * third);

  return (
    <section className={cn("w-full", className)} ref={gridRef}>
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-start  max-w-7xl mx-auto gap-10 py-40 px-5"
        ref={gridRef}
      >
        <div className="grid gap-10">
          {firstPart.map((el, idx) => (
            <motion.div
              key={"grid-1-" + idx}
              style={{ y: translateFirst }}
            >
              <img
                src={el}
                className="h-80 w-full object-cover object-top-left rounded-lg gap-10 m-0! p-0!"
                height="400"
                width="400"
                alt="thumbnail"
              />
            </motion.div>
          ))}
        </div>

        <div className="grid gap-10">
          {secondPart.map((el, idx) => (
            <motion.div
              key={"grid-2-" + idx}
              style={{ y: translateSecond }}
            >
              <img
                src={el}
                className="h-80 w-full object-cover object-top-left rounded-lg gap-10 m-0! p-0!"
                height="400"
                width="400"
                alt="thumbnail"
              />
            </motion.div>
          ))}
        </div>

        {/* COLUNA 3 */}
        <div className="grid gap-10">
          {thirdPart.map((el, idx) => (
            <motion.div
              key={"grid-3-" + idx}
              style={{ y: translateThird }}
            >
              <img
                src={el}
                className="h-80 w-full object-cover object-top-left rounded-lg gap-10 m-0! p-0!"
                height="400"
                width="400"
                alt="thumbnail"
              />
            </motion.div>
          ))}
        </div>

        <div className="grid gap-10">
          {fourthPart.map((el, idx) => (
            <motion.div
              key={"grid-3-" + idx}
              style={{ y: translatefourth }}
            >
              <img
                src={el}
                className="h-80 w-full object-cover object-top-left rounded-lg gap-10 m-0! p-0!"
                height="400"
                width="400"
                alt="thumbnail"
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};