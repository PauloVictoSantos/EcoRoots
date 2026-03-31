'use client'

import HeroSection from '@/components/sections/HeroSection'
import {AboutSection} from '@/components/sections/about-section'
import {FeaturesSection}  from '@/components/sections/FeaturesSection'
import { TimelineSection } from '@/components/sections/TimelineSection'
import { TeamSection } from '@/components/sections/TeamSection'
import {GallerySection} from '@/components/sections/GallerySection'
import ComponentsSection from '@/components/sections/Components'
import FAQSection from '@/components/sections/FAQSection'
import CTABand from '@/components/sections/CTABand'

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <TimelineSection />
      <TeamSection />
      <GallerySection />
      <ComponentsSection />
      <FAQSection />
      <CTABand />
    </main>
  )
}
