import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import { Footer } from './components/Footer'
import { Nav } from './components/Nav'
import { StarField } from './components/StarField'
import { ThemeToggle } from './components/ThemeToggle'
import { About } from './pages/About'
import { Home } from './pages/Home'

export default function App() {
  const { pathname } = useLocation()
  const reduce = useReducedMotion()

  return (
    <div className="relative">
      <ScrollManager />
      <StarField />
      <Nav />
      <div className="relative mx-auto max-w-[1440px]">
        <ThemeToggle />
      </div>
      {/* Keyed by page so each page fades in when you switch. */}
      <motion.main
        key={pathname}
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0.1 : 0.3, ease: [0.23, 1, 0.32, 1] }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.main>
      <Footer />
    </div>
  )
}

/** New page → jump to top. Same page or a "#section" link → scroll to that spot. */
function ScrollManager() {
  const { pathname, hash, key } = useLocation()
  const prevPath = useRef(pathname)
  const first = useRef(true)

  useEffect(() => {
    // First load: let the browser keep its own scroll position (e.g. on refresh).
    if (first.current && !hash) {
      first.current = false
      return
    }
    first.current = false
    const samePage = prevPath.current === pathname
    prevPath.current = pathname
    const behavior: ScrollBehavior = samePage ? 'smooth' : 'instant'
    if (hash) {
      // Wait a frame so the new page's sections exist.
      requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior }))
    } else {
      window.scrollTo({ top: 0, behavior })
    }
  }, [pathname, hash, key])

  return null
}
