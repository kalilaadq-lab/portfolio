import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/** Fade/slide content in once when it scrolls into view. Reduced motion → opacity only. */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
