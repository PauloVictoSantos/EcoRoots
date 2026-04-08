"use client";

import { useState } from "react";
import Link from "next/link";
import { LuClock, LuArrowRight } from "react-icons/lu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SpotlightCard } from "./spotlight-card";
import type { Post } from "@/lib/posts";

interface PostCardProps {
  post: Post;
  index: number;
}

export function PostCard({ post, index }: PostCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <SpotlightCard>
      <Link
        href={`/blog/${post.slug}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group block rounded-(--radius) border border-border bg-card overflow-hidden transition-all duration-500 ease-in-out"
      >
        <div className="relative h-50 bg-linear-to-br from-[#0a0a0a] via-[#1c1c1c] to-[#0a0a0a] overflow-hidden">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background: `
                radial-gradient(ellipse at 20% 50%, rgba(93,214,44,0.15) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 20%, rgba(88,214,141,0.1) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 80%, rgba(30,132,73,0.12) 0%, transparent 50%)
              `,
            }}
          />

          {/* Animated grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(88,214,141,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(88,214,141,0.05) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
              animation: isHovered ? "grid-move 10s linear infinite" : "none",
            }}
          />

          {/* Floating icon */}
          <div
            className="absolute top-1/2 left-1/2 text-5xl transition-transform duration-500"
            style={{
              transform: `translate(-50%, -50%) scale(${isHovered ? 1.2 : 1})`,
              filter: "drop-shadow(0 0 20px rgba(93,214,44,0.3))",
            }}
          >
            {post.icon}
          </div>

          {/* Category badge */}
          <Badge
            variant="outline"
            className="absolute top-4 left-4 border-(--amazon-dark)/20 bg-(--amazon-dark)/15 text-amazon-dark backdrop-blur-xl text-xs font-semibold uppercase tracking-wider"
          >
            {post.category}
          </Badge>

          {/* Read time */}
          <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs text-[#9CA3AF] backdrop-blur-xl">
            <LuClock className="h-3 w-3" />
            {post.readTime}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="mb-2 font-mono text-xs text-muted-foreground">
            {post.date}
          </p>

          <h3
            className="mb-3 text-xl font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-amazon-dark"
          >
            {post.title}
          </h3>

          <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>

          {/* Author + CTA */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-linear-to-br from-amazon-dark to-amazon-accent text-xs font-bold text-[#0A0A0A]">
                  {post.author.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-[13px] font-semibold text-foreground">
                  {post.author.name}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {post.author.role}
                </p>
              </div>
            </div>

            <span className="flex items-center gap-1.5 text-[13px] font-semibold text-amazon-dark">
              Ler mais
              <LuArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </div>
        </div>
      </Link>
    </SpotlightCard>
  );
}
