'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function SectionWrapper({ children, className, id }: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn('py-20 md:py-28', className)}
    >
      {children}
    </motion.section>
  )
}

export function SectionHeader({
  badge,
  title,
  description,
  centered = true,
}: {
  badge?: string
  title: string
  description?: string
  centered?: boolean
}) {
  return (
    <div className={cn('mb-12 md:mb-16', centered && 'text-center')}>
      {badge && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-[#58D68D]/10 text-[#58D68D] border border-[#58D68D]/20 mb-4"
        >
          {badge}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={cn(
            'mt-4 text-muted-foreground text-lg leading-relaxed',
            centered && 'max-w-2xl mx-auto'
          )}
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}
