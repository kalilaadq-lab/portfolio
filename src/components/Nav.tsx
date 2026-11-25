import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { MAILTO } from '../lib/links'

// `href` = plain external link (mailto); `to` = in-app route.
type Item = { id: string; label: string; to?: string; href?: string }

const ITEMS: Item[] = [
  { id: 'home', label: 'Home', to: '/' },
  { id: 'works', label: 'Works', to: '/#works' },
  { id: 'about', label: 'About', to: '/about' },
  { id: 'email', label: 'Email Me', href: MAILTO },
]

const ITEM_CLASS =
  'pressable relative flex min-h-8 items-center justify-center rounded-full px-[14px] py-[6px] text-sm leading-5 font-medium tracking-[-0.28px] whitespace-nowrap'

/** Floating pill navigation + the blurred fade behind it (Figma: Floating Pill Navigation / Mask Group). */
export function Nav() {
  const { pathname } = useLocation()
  const [section, setSection] = useState<'home' | 'works'>('home')
  const reduce = useReducedMotion()
  const active = pathname === '/about' ? 'about' : section

  // On the home page, highlight "Works" while the works grid is in view.
  useEffect(() => {
    const works = document.getElementById('works')
    if (pathname !== '/' || !works) return
    const io = new IntersectionObserver(
      ([entry]) => setSection(entry.isIntersecting ? 'works' : 'home'),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    io.observe(works)
    return () => io.disconnect()
  }, [pathname])

  return (
    <>
      {/* Desktop: fade at the top. Mobile (Figma 390w): nav + fade sit at the bottom. */}
      <Fade className="top-0 hidden h-[104px] sm:block" dir="to bottom" />
      <Fade className="bottom-0 h-[128px] sm:hidden" dir="to top" />
      <nav aria-label="Main navigation" className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 sm:top-5 sm:bottom-auto">
        <ul className="flex items-center rounded-full p-1" style={{ background: 'var(--nav-bg)' }}>
          {ITEMS.map((item) => {
            const isActive = active === item.id
            if (item.href) {
              return (
                <li key={item.id}>
                  <a href={item.href} className={ITEM_CLASS} style={{ color: 'var(--nav-fg)' }}>
                    <span className="relative">{item.label}</span>
                  </a>
                </li>
              )
            }
            return (
              <li key={item.id}>
                <Link
                  to={item.to ?? '/'}
                  aria-current={isActive ? 'page' : undefined}
                  className={ITEM_CLASS}
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
                </Link>
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
