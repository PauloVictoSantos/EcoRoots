'use client'

import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import TechSection from '@/components/sections/TechSection'
import { TimelineSection } from '@/components/sections/TimelineSection'
import { TeamSection } from '@/components/sections/TeamSection'
import GallerySection from '@/components/sections/GallerySection'
import FAQSection from '@/components/sections/FAQSection'
import CTABand from '@/components/sections/CTABand'
import { TerminalDevSection } from '@/components/sections/TerminalDevSection'

export function HomePageClient() {
  return (
    <main className="bg-[#0A0A0A] text-white overflow-x-hidden">
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <TechSection />
      <TimelineSection />
      <TerminalDevSection />
      <TeamSection />
      <GallerySection />
      <FAQSection />
      <CTABand />
    </main>
  )
}
