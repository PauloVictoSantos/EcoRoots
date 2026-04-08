"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Play, X, Plus } from "lucide-react";
import type { DriveFile } from "@/lib/drive";

const VISIBLE_LIMIT = 6;

const cardShadow =
  "shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset]";

export function TimelineMediaGrid({ files }: { files: DriveFile[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFile, setActiveFile] = useState<DriveFile | null>(null);

  if (!files.length) {
    return (
      <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
        Nenhum arquivo nesta semana ainda.
      </p>
    );
  }

  const visible = files.slice(0, VISIBLE_LIMIT);
  const hidden = files.slice(VISIBLE_LIMIT);
  const hasMore = hidden.length > 0;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {visible.map((file) => (
          <MediaCard
            key={file.id}
            file={file}
            onClick={() => setActiveFile(file)}
          />
        ))}

        {hasMore && (
          <button
            onClick={() => setModalOpen(true)}
            className={`group relative flex h-20 w-full items-center justify-center rounded-lg border border-dashed border-[#58D68D]/40 bg-[#58D68D]/5 transition hover:bg-[#58D68D]/10 md:h-44 lg:h-60 ${cardShadow}`}
          >
            <div className="flex flex-col items-center gap-2 text-[#58D68D]">
              <Plus className="h-6 w-6 transition group-hover:scale-110" />
              <span className="text-xs font-semibold md:text-sm">
                Ver mais ({hidden.length})
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Modal "Ver mais" — grid completo */}
      <AnimatePresence>
        {modalOpen && (
          <Modal onClose={() => setModalOpen(false)} title="Todos os arquivos">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {files.map((file) => (
                <MediaCard
                  key={file.id}
                  file={file}
                  onClick={() => {
                    setActiveFile(file);
                    setModalOpen(false);
                  }}
                />
              ))}
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Lightbox — arquivo único */}
      <AnimatePresence>
        {activeFile && (
          <Modal onClose={() => setActiveFile(null)} title={activeFile.name}>
            <FilePreview file={activeFile} />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

function MediaCard({
  file,
  onClick,
}: {
  file: DriveFile;
  onClick: () => void;
}) {
  const base = `relative h-20 w-full overflow-hidden rounded-lg md:h-44 lg:h-60 ${cardShadow} group cursor-pointer`;

  if (file.kind === "pdf") {
    return (
      <button onClick={onClick} className={`${base} bg-neutral-900/40 border border-[#58D68D]/20`}>
        <div className="flex h-full flex-col items-center justify-center gap-2 p-2">
          <FileText className="h-8 w-8 text-[#58D68D]" />
          <span className="line-clamp-2 text-center text-[10px] text-neutral-300 md:text-xs">
            {file.name}
          </span>
        </div>
      </button>
    );
  }

  if (file.kind === "other") {
    return (
      <button onClick={onClick} className={`${base} bg-neutral-900/40 border border-neutral-700`}>
        <div className="flex h-full items-center justify-center p-2 text-center text-[10px] text-neutral-400 md:text-xs">
          {file.name}
        </div>
      </button>
    );
  }

  // imagem ou vídeo: usa thumbnail
  return (
    <button onClick={onClick} className={base}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={file.thumbnailUrl}
        alt={file.name}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        loading="lazy"
      />
      {file.kind === "video" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/40">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#58D68D]/90 shadow-lg">
            <Play className="h-5 w-5 translate-x-0.5 fill-black text-black" />
          </div>
        </div>
      )}
    </button>
  );
}

function FilePreview({ file }: { file: DriveFile }) {
  if (file.kind === "video") {
    return (
      <div className="aspect-video w-full">
        <iframe
          src={file.directUrl}
          allow="autoplay"
          allowFullScreen
          className="h-full w-full rounded-lg"
        />
      </div>
    );
  }

  if (file.kind === "pdf") {
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <FileText className="h-16 w-16 text-[#58D68D]" />
        <p className="text-center text-sm text-neutral-300">{file.name}</p>
        <a 
          href={file.viewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-[#58D68D] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#58D68D]/80"
        >
          Abrir PDF no Drive
        </a>
      </div>
    );
  }

  if (file.kind === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={file.thumbnailUrl}
        alt={file.name}
        className="max-h-[80vh] w-full rounded-lg object-contain"
      />
    );
  }

  return (
    <a 
      href={file.viewUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-8 text-center text-[#58D68D] underline"
    >
      Abrir no Drive
    </a>
  );
}

function Modal({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-[#58D68D]/20 bg-[#0a0a0a] p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="line-clamp-1 text-lg font-bold text-neutral-100">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}