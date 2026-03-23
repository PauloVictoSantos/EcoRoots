'use client'

import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import {FeaturesSection}  from '@/components/sections/FeaturesSection'
import TechSection from '@/components/sections/TechSection'
import { TimelineSection } from '@/components/sections/TimelineSection'
import { TeamSection } from '@/components/sections/TeamSection'
import GallerySection from '@/components/sections/GallerySection'
import FAQSection from '@/components/sections/FAQSection'
import CTABand from '@/components/sections/CTABand'

export function HomePageClient() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <TechSection />
      <TimelineSection />
      <TeamSection />
      <GallerySection />
      <FAQSection />
      <CTABand />
    </main>
  )
}
