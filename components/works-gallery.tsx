"use client"

import { useState } from "react"
import { VideoCard } from "./video-card"
import { CustomCursor } from "./custom-cursor"

const projects = [
  {
    id: 1,
    title: "FASHION STUDIO",
    category: "BRANDING",
    year: "2024",
    thumbnail: "/",
    video: "",
  },
  {
    id: 2,
    title: "ARCHITECTURE FIRM",
    category: "DESIGN",
    year: "2024",
    thumbnail: "/image/Captura de tela 2026-04-05 123949.png",
    video: "https://drive.google.com/file/d/1tHUjHmBJFGZs7gjV1AEdItRKHx-ti07o/view?usp=drive_link",
  },
  {
    id: 3,
    title: "PRODUCT LAUNCH",
    category: "CREATIVE",
    year: "2024",
    thumbnail: "/image/Captura de tela 2026-04-05 123359.png",
    video: "/image/175714-854057973.mp4",
  },
  {
    id: 4,
    title: "STUDIO VALE",
    category: "MARKETING",
    year: "2024",
    thumbnail: "",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
  {
    id: 5,
    title: "AUTOMOTIVE",
    category: "COMMERCIAL",
    year: "2024",
    thumbnail: "",
    video: "",
  },
]

export function WorksGallery() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <>
      <CustomCursor isActive={hoveredId !== null} />
      <div className="container mx-auto px-6">
        <div className="flex gap-4 items-stretch">
          {projects.map((project) => (
            <VideoCard
              key={project.id}
              project={project}
              isHovered={hoveredId === project.id}
              onHoverChange={(hovered: any) => setHoveredId(hovered ? project.id : null)}
            />
          ))}
        </div>
      </div>
    </>
  )
}
