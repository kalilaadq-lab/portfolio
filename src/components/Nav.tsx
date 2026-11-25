import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

type Item = { id: string; label: string; href: string }

// About & Email Me have no destination yet — wire them up later.
const ITEMS: Item[] = [
  { id: 'home', label: 'Home', href: '#top' },
  { id: 'works', label: 'Works', href: '#works' },
  { id: 'about', label: 'About', href: '#' },
  { id: 'email', label: 'Email Me', href: '#' },
]

/** Floating pill navigation + the blurred fade behind it (Figma: Floating Pill Navigation / Mask Group). */
export function Nav() {
  const [active, setActive] = useState('home')
  const reduce = useReducedMotion()

  // Highlight "Works" while the works grid is in view.
  useEffect(() => {
    const works = document.getElementById('works')
    if (!works) return
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting ? 'works' : 'home'),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    io.observe(works)
    return () => io.disconnect()
  }, [])

  return (
    <>
      {/* Desktop: fade at the top. Mobile (Figma 390w): nav + fade sit at the bottom. */}
      <Fade className="top-0 hidden h-[104px] sm:block" dir="to bottom" />
      <Fade className="bottom-0 h-[128px] sm:hidden" dir="to top" />
      <nav aria-label="Main navigation" className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 sm:top-5 sm:bottom-auto">
        <ul className="flex items-center rounded-full p-1" style={{ background: 'var(--nav-bg)' }}>
          {ITEMS.map((item) => {
            const isActive = active === item.id
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={(e) => {
                    if (item.href === '#') e.preventDefault()
                    else setActive(item.id)
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className="pressable relative flex min-h-8 items-center justify-center rounded-full px-[14px] py-[6px] text-sm leading-5 font-medium tracking-[-0.28px] whitespace-nowrap"
                  style={{
                    color: isActive ? 'var(--nav-active-fg)' : 'var(--nav-fg)',
                    transition: 'color 200ms ease',
                  }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full"
                      style={{ background: 'var(--nav-active-bg)' }}
                      transition={reduce ? { duration: 0 } : { type: 'spring', duration: 0.4, bounce: 0.15 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}

function Fade({ className, dir }: { className: string; dir: 'to bottom' | 'to top' }) {
  const mask = `linear-gradient(${dir}, black 0%, black 34%, transparent 100%)`
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 z-30 opacity-90 backdrop-blur-[5px] ${className}`}
      style={{
        backgroundImage: `linear-gradient(${dir}, var(--nav-fade), transparent)`,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  )
}
