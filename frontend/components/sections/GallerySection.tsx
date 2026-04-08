"use client";
import { useEffect, useState } from "react";
import { ParallaxScroll } from "../ui/parallax-scroll";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.65, delay, ease: [0.4, 0, 0.2, 1] },
});

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
};

type MediaItem = {
  id: string;
  name: string;
  type: "image" | "video";
  url: string;        // para <img> ou thumbnail do vídeo
  embedUrl?: string;  // para <iframe> (vídeos)
};

export function GallerySection() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GDRIVE_API_KEY;
    const folderId = process.env.NEXT_PUBLIC_GDRIVE_FOLDER_ID;

    if (!apiKey || !folderId) {
      setError("Credenciais do Drive não configuradas.");
      setLoading(false);
      return;
    }

    const url = new URL("https://www.googleapis.com/drive/v3/files");
    url.searchParams.set(
      "q",
      `'${folderId}' in parents and (mimeType contains 'image/' or mimeType contains 'video/') and trashed = false`
    );
    url.searchParams.set(
      "fields",
      "files(id,name,mimeType,thumbnailLink)"
    );
    url.searchParams.set("pageSize", "100");
    url.searchParams.set("orderBy", "name");
    url.searchParams.set("key", apiKey);

    fetch(url.toString())
      .then((res) => {
        if (!res.ok) throw new Error(`Drive API: ${res.status}`);
        return res.json();
      })
      .then((data: { files: DriveFile[] }) => {
        const items: MediaItem[] = (data.files ?? []).map((f) => {
          const isVideo = f.mimeType.startsWith("video/");
          return {
            id: f.id,
            name: f.name,
            type: "image",
            url: `https://lh3.googleusercontent.com/d/${f.id}=w1600`,
          };
        });
        setMedia(items);
      })
      .catch((err) => {
        console.error(err);
        setError("Não foi possível carregar as mídias.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Se o ParallaxScroll só aceita imagens, passa só as URLs de imagem
  const imageUrls = media.filter((m) => m.type === "image").map((m) => m.url);

  return (
    <div id="galeria" className="relative z-20 mx-auto max-w-7xl py-20 lg:py-40">
      <div>
        <motion.span
          {...fadeUp(0)}
          className="inline-block text-xs font-semibold tracking-widest text-[#58D68D] uppercase mb-4"
        >
          Galeria
        </motion.span>
        <motion.h2
          {...fadeUp(0.1)}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          A Estufa em{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-amazon-dark">
            Imagens
          </span>
        </motion.h2>
        <motion.p
          {...fadeUp(0.2)}
          className="text-[#9CA3AF] text-lg leading-relaxed mb-8"
        >
          Registro visual do projeto — da montagem do hardware à estufa em operação completa.
        </motion.p>
      </div>

      {loading && (
        <p className="text-[#9CA3AF] text-center py-20">Carregando mídias...</p>
      )}
      {error && <p className="text-red-400 text-center py-20">{error}</p>}

      {!loading && !error && imageUrls.length > 0 && (
        <ParallaxScroll images={imageUrls} />
      )}

      {!loading && !error && media.length === 0 && (
        <p className="text-[#9CA3AF] text-center py-20">
          Nenhuma mídia encontrada na pasta.
        </p>
      )}
    </div>
  );
}