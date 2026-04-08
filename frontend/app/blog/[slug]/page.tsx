import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LuArrowLeft, LuCalendarDays, LuClock } from "react-icons/lu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { posts, getPostBySlug } from "@/lib/posts";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { PostContent } from "@/components/blog/post-content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <>
      <ReadingProgress />

      <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">

        <Button
          variant="outline"
          size="sm"
          asChild
          className="mb-8 border-border bg-card transition-colors hover:border-(--amazon-dark)/40 hover:bg-(--amazon-dark)/5"
        >
          <Link href="/">
            <LuArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Blog
          </Link>
        </Button>

        {/* Hero */}
        <div className="relative mb-10 overflow-hidden rounded-(--radius) bg-linear-to-br from-[#0a0a0a] via-[#1c1c1c] to-[#0a0a0a]">
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at 30% 50%, rgba(93,214,44,0.12) 0%, transparent 60%),
                radial-gradient(ellipse at 70% 30%, rgba(88,214,141,0.08) 0%, transparent 50%)
              `,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(88,214,141,0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(88,214,141,0.04) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />

          <div className="relative px-8 pb-8 pt-32 sm:px-10 sm:pt-40">
            <Badge
              variant="outline"
              className="mb-4 border-(--amazon-dark)/25 bg-(--amazon-dark)/15 text-xs font-semibold uppercase tracking-widest text-amazon-dark"
            >
              {post.category}
            </Badge>
            <h1 className="max-w-2xl text-3xl font-extrabold leading-tight text-[#EAEAEA] sm:text-4xl lg:text-[42px]">
              {post.title}
            </h1>
          </div>
        </div>

        {/* Meta bar */}
        <div className="mb-10 flex flex-wrap items-center gap-6 rounded-(--radius) border border-border bg-card px-6 py-5">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11">
              <AvatarFallback className="bg-linear-to-br from-amazon-dark to-amazon-accent text-sm font-bold text-[#0A0A0A]">
                {post.author.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-[15px] font-semibold text-foreground">
                {post.author.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {post.author.role}
              </p>
            </div>
          </div>

          <Separator orientation="vertical" className="hidden h-8 sm:block" />

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <LuCalendarDays className="h-3.5 w-3.5" />
            {post.date}
          </div>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <LuClock className="h-3.5 w-3.5" />
            {post.readTime} de leitura
          </div>
        </div>

        {/* Body */}
        <div className="mx-auto max-w-180">
          <p className="mb-8 border-b border-border pb-6 text-lg font-medium leading-relaxed text-foreground">
            {post.excerpt}
          </p>

          <PostContent content={post.content} />
        </div>
      </article>
    </>
  );
}
