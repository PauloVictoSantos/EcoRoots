'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.65, delay, ease: [0.4, 0, 0.2, 1] },
})

export default function CTABand() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp()}
          className="relative rounded-3xl overflow-hidden border border-[#58D68D]/15 bg-linear-to-br from-[#0B3D2E]/60 to-[#0a0a0a] p-12 md:p-16 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,#145A32_0%,transparent_65%)] opacity-25" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Pronto para começar?</h2>
            <p className="text-[#9CA3AF] text-lg mb-8 max-w-xl mx-auto">
              Acesse o dashboard em tempo real ou explore o gêmeo digital 3D da estufa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard/estufa"
                className="px-8 py-4 rounded-2xl bg-linear-to-r from-[#1E8449] to-[#145A32] hover:from-[#58D68D] hover:to-[#1E8449] text-white font-semibold transition-all duration-300 shadow-xl shadow-[#1E8449]/30">
                Ver Estufa 3D
              </Link>
              <Link href="/dashboard"
                className="px-8 py-4 rounded-2xl border border-[#58D68D]/25 hover:bg-[#58D68D]/8 text-white font-semibold transition-all">
                Abrir Dashboard
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}