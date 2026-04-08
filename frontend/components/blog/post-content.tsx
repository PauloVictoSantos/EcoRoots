import type { ReactNode } from "react";

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  const blocks = content.split("\n\n");

  const rendered: ReactNode[] = blocks.map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="mt-12 mb-4 border-l-[3px] border-amazon-dark pl-4 text-2xl font-bold text-foreground"
        >
          {block.replace("## ", "")}
        </h2>
      );
    }

    if (block.startsWith("### ")) {
      return (
        <h3
          key={i}
          className="mt-8 mb-3 text-xl font-semibold text-amazon-dark"
        >
          {block.replace("### ", "")}
        </h3>
      );
    }

    return (
      <p
        key={i}
        className="mb-5 text-[17px] leading-[1.9] text-muted-foreground"
      >
        {block}
      </p>
    );
  });

  return <>{rendered}</>;
}
