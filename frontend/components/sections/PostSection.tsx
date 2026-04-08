import type { Metadata } from "next";
import { posts } from "@/lib/posts";
import { PostCard } from "@/components/blog/post-card";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Explorando tecnologia, desenvolvimento e inovação com profundidade e clareza.",
};

export default function BlogPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-600">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-(--amazon-dark)/15 bg-(--amazon-dark)/8 px-4 py-1.5 text-[13px] font-semibold tracking-wider text-amazon-dark">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amazon-dark" />
          Diário Técnico
        </div>

        <h1 className="mb-4 bg-linear-to-r from-foreground via-amazon-dark to-amazon-highlight bg-clip-text text-5xl font-extrabold leading-tight text-transparent sm:text-6xl">
          De Dentro do Lab
        </h1>

        <p className="mx-auto max-w-md text-lg leading-relaxed text-muted-foreground">
          Decisões de projeto, experimentos com sensores e aprendizados reais de quem montou o sistema do zero.
        </p>
      </div>

      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <PostCard key={post.slug} post={post} index={i} />
        ))}
      </div>
    </section>
  );
}
