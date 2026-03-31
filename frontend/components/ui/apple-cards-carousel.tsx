"use client";
import React, { useEffect, useRef, useState, createContext, useContext } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface CardData { src: string; title: string; category: string; content: React.ReactNode; }

const CarouselContext = createContext<{ onCardClose: (i: number) => void; currentIndex: number }>({
  onCardClose: () => {}, currentIndex: 0,
});

export const Carousel = ({ items, initialScroll = 0 }: { items: React.JSX.Element[]; initialScroll?: number }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) carouselRef.current.scrollLeft = initialScroll;
  }, [initialScroll]);

  const checkScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
  }, []);

  const scrollBy = (dir: "left" | "right") => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <CarouselContext.Provider value={{ onCardClose: setCurrentIndex, currentIndex }}>
      <div className="relative w-full">
        <div ref={carouselRef} onScroll={checkScroll}
          className="flex w-full overflow-x-scroll scroll-smooth py-10 [scrollbar-width:none] overscroll-x-auto"
          style={{ scrollbarWidth: "none" }}>
          <div className="flex flex-row gap-4 pl-4 mx-auto max-w-7xl">
            {items.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * i }}>
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 mr-10">
          <button onClick={() => scrollBy("left")} disabled={!canScrollLeft}
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full border border-[#58D68D]/20 bg-[#0a0a0a] disabled:opacity-40 hover:border-[#58D68D]/40 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#58D68D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button onClick={() => scrollBy("right")} disabled={!canScrollRight}
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full border border-[#58D68D]/20 bg-[#0a0a0a] disabled:opacity-40 hover:border-[#58D68D]/40 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#58D68D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({ card, index, layout = false }: { card: CardData; index: number; layout?: boolean }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); onCardClose(index); } };
    if (open) { document.body.style.overflow = "hidden"; document.addEventListener("keydown", onKey); }
    else document.body.style.overflow = "auto";
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setOpen(false); onCardClose(index); }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div ref={containerRef} layoutId={layout ? `card-${card.title}` : undefined}
              className="relative z-60 m-4 max-h-[90vh] max-w-3xl w-full overflow-y-auto rounded-3xl bg-[#111] border border-[#58D68D]/15 shadow-2xl">
              <button onClick={() => { setOpen(false); onCardClose(index); }}
                className="sticky top-4 right-4 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1a1a] border border-white/10 z-50 float-right mr-4">
                <X className="h-4 w-4 text-[#9CA3AF]" />
              </button>
              <motion.p layoutId={layout ? `category-${card.title}` : undefined}
                className="pt-6 px-6 text-sm font-medium text-[#58D68D]">{card.category}</motion.p>
              <motion.p layoutId={layout ? `title-${card.title}` : undefined}
                className="px-6 pb-6 text-2xl font-bold text-white">{card.title}</motion.p>
              <div className="px-6 pb-6">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.button onClick={() => setOpen(true)} layoutId={layout ? `card-${card.title}` : undefined}
        className="relative z-10 flex h-80 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl bg-[#111] border border-white/6 hover:border-[#58D68D]/20 transition-all duration-300 md:h-160 md:w-96">
        <div className="absolute inset-x-0 top-0 z-30 h-full bg-linear-to-b from-black/50 via-transparent to-black/60 pointer-events-none" />
        <div className="relative z-40 p-8">
          <motion.p layoutId={layout ? `category-${card.title}` : undefined}
            className="text-left font-sans text-sm font-medium text-[#58D68D]">{card.category}</motion.p>
          <motion.p layoutId={layout ? `title-${card.title}` : undefined}
            className="mt-2 max-w-xs text-left font-sans text-xl font-bold text-white md:text-2xl">{card.title}</motion.p>
        </div>
        <BlurImage src={card.src} alt={card.title} />
      </motion.button>
    </>
  );
};

const BlurImage = ({ src, alt }: { src: string; alt: string }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <img src={src} alt={alt} onLoad={() => setLoaded(true)}
      className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
        loaded ? "opacity-100" : "opacity-0")} />
  );
};
