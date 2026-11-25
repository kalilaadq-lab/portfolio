import { motion, useReducedMotion } from 'motion/react'

// All grey placeholders for now. When a project is ready, drop its thumbnail in
// src/assets/works/, import it here and set `image` (e.g. the HRIS & IoT exports already there).
const WORKS: { title: string; image?: string }[] = Array.from({ length: 10 }, (_, i) => ({
  title: `Project ${i + 1} (coming soon)`,
}))

export function Works() {
  const reduce = useReducedMotion()

  return (
    <section id="works" aria-label="Works" className="scroll-mt-24 px-2 py-20">
      <ul className="mx-auto grid max-w-[1424px] grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {WORKS.map((w, i) => (
          <motion.li
            key={w.title}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: (i % 3) * 0.06 }}
          >
            <div
              className="work-card group relative aspect-[469.33/351.98] overflow-hidden rounded-[30px]"
              style={{ background: 'var(--placeholder)' }}
            >
              {w.image ? (
                <img
                  src={w.image}
                  alt={w.title}
                  loading="lazy"
                  className="work-card-img absolute inset-0 size-full object-cover"
                />
              ) : (
                <span className="sr-only">{w.title}</span>
              )}
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
