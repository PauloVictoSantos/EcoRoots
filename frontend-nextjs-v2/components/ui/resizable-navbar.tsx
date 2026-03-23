"use client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import Link from "next/link";
import React, { useRef, useState } from "react";

function LeafLogoIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 3C16 3 5 8 5 18C5 23.5 9.5 28 16 28C22.5 28 27 23.5 27 18C27 8 16 3 16 3Z" fill="#1E8449" opacity="0.9"/>
      <path d="M16 3C16 3 22 10 20 20C18.5 26 16 28 16 28" stroke="#58D68D" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 28V14" stroke="#58D68D" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 18C16 18 10 15 9 11" stroke="#58D68D" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
      <path d="M16 22C16 22 21 19 23 15" stroke="#58D68D" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
}

interface NavItem { name: string; link: string; }

export const Navbar = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (cur) => {
    const prev = scrollY.getPrevious() ?? 0;
    setVisible(cur < 80 || cur < prev);
  });
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: -100 }}
        animate={{ y: visible ? 0 : -120, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className={cn("fixed inset-x-0 top-0 z-50 w-full", className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export const NavBody = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ backdropFilter: "blur(0px)" }}
    animate={{ backdropFilter: "blur(16px)" }}
    className={cn(
      "relative z-[60] mx-auto hidden max-w-5xl items-center justify-between rounded-2xl border border-[#58D68D]/10 bg-[#0a0a0a]/80 px-6 py-3 shadow-lg shadow-black/30 lg:flex mt-4",
      className
    )}
  >
    {children}
  </motion.div>
);

export const NavItems = ({ items, className }: { items: NavItem[]; className?: string }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className={cn("flex items-center gap-1", className)} onMouseLeave={() => setHovered(null)}>
      {items.map((item, i) => (
        <Link
          key={item.link}
          href={item.link}
          onMouseEnter={() => setHovered(i)}
          className="relative px-4 py-2 text-sm font-medium text-[#9CA3AF] transition-colors hover:text-white"
        >
          {hovered === i && (
            <motion.div
              layoutId="nav-hovered"
              className="absolute inset-0 rounded-xl bg-[#58D68D]/8 border border-[#58D68D]/15"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{item.name}</span>
        </Link>
      ))}
    </div>
  );
};

export const NavbarLogo = () => (
  <Link href="/" className="flex items-center gap-2.5 group relative z-20">
    <motion.div whileHover={{ scale: 1.08, rotate: 5 }} transition={{ type: "spring", stiffness: 400 }}>
      <LeafLogoIcon />
    </motion.div>
    <span className="font-bold text-sm tracking-tight text-white group-hover:text-[#58D68D] transition-colors">
      Smart<span className="text-[#58D68D]">Greenhouse</span>
    </span>
  </Link>
);

export const NavbarButton = ({
  href, children, onClick, className, variant = "ghost",
}: {
  href?: string; children: React.ReactNode; onClick?: () => void;
  className?: string; variant?: "ghost" | "primary" | "outline";
}) => {
  const base = "relative z-20 flex cursor-pointer items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200";
  const variants = {
    ghost: "text-[#9CA3AF] hover:text-white hover:bg-white/5",
    primary: "bg-gradient-to-r from-[#1E8449] to-[#145A32] hover:from-[#58D68D] hover:to-[#1E8449] text-white shadow-lg shadow-[#1E8449]/20",
    outline: "border border-[#58D68D]/25 text-white hover:bg-[#58D68D]/8",
  };
  if (href) return <Link href={href} className={cn(base, variants[variant], className)}>{children}</Link>;
  return <button onClick={onClick} className={cn(base, variants[variant], className)}>{children}</button>;
};

export const MobileNav = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("relative z-50 mx-auto flex max-w-[calc(100vw-1rem)] flex-col items-center justify-between lg:hidden", className)}>
    {children}
  </div>
);

export const MobileNavHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex w-full items-center justify-between rounded-2xl border border-[#58D68D]/10 bg-[#0a0a0a]/90 px-5 py-3 mt-3 backdrop-blur-xl", className)}>
    {children}
  </div>
);

export const MobileNavMenu = ({
  children, isOpen, onClose, className,
}: { children: React.ReactNode; isOpen: boolean; onClose: () => void; className?: string }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className={cn("absolute top-full left-0 right-0 z-50 mt-2 flex w-full flex-col gap-2 rounded-2xl border border-[#58D68D]/10 bg-[#0a0a0a]/95 px-5 py-4 shadow-2xl backdrop-blur-xl", className)}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

export const MobileNavToggle = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => (
  <button onClick={onClick} className="relative z-20 flex h-8 w-8 flex-col items-center justify-center gap-1.5">
    <motion.span animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
      className="block h-0.5 w-5 bg-white transition-all" />
    <motion.span animate={isOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
      className="block h-0.5 w-5 bg-white transition-all" />
    <motion.span animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
      className="block h-0.5 w-5 bg-white transition-all" />
  </button>
);
