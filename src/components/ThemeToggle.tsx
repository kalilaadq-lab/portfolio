import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from 'motion/react'
import moon from '../assets/icons/toggle-moon.svg'
import sun from '../assets/icons/toggle-sun.svg'
import { useTheme } from '../lib/theme'

/**
 * Hanging "pull cord" theme switch (Figma: Theme Toggle, 48 × 220 at x=1326 of 1440).
 * Clicking tugs the cord down and springs back, like a lamp switch.
 */
export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const reduce = useReducedMotion()
  const cord = useAnimationControls()
  const isDark = theme === 'dark'

  const onClick = () => {
    toggle()
    if (!reduce) {
      cord.start({
        y: [0, 14, 0],
        transition: { duration: 0.45, times: [0, 0.3, 1], ease: [0.23, 1, 0.32, 1] },
      })
    }
  }

  return (
    <motion.div
      animate={cord}
      className="absolute top-0 right-3 z-40 h-[110px] w-12 sm:right-[4.6%] sm:h-[220px]"
    >
      {/* Cord */}
      <svg aria-hidden className="absolute inset-x-0 top-0 h-[76px] w-12 sm:h-[146px]" viewBox="0 0 48 146" preserveAspectRatio="none">
        <path
          d="M24 0.8V144.8"
          strokeWidth={1.6}
          strokeLinecap="round"
          style={{ stroke: 'var(--toggle-cord)', transition: 'stroke 300ms ease' }}
        />
      </svg>

      {/* Switch */}
      <button
        type="button"
        onClick={onClick}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        aria-pressed={isDark}
        className="pressable absolute top-[72px] left-1/2 sm:top-[142px] size-[30px] -translate-x-1/2 cursor-pointer rounded-[15px] border"
        style={{
          borderColor: 'var(--toggle-border)',
          backgroundImage: 'var(--toggle-bg)',
          boxShadow:
            '0px 2px 0px 0px #a6a49c, 0px 5px 8px 0px rgba(45,42,32,0.2), inset 0px 1px 1px 0px white, inset 0px -2px 2px 0px rgba(91,86,71,0.18)',
        }}
      >
        <span
          className="absolute inset-[3px] flex items-center justify-center rounded-[11px] drop-shadow-[0px_1px_0px_rgba(255,255,255,0.9)]"
          style={{ backgroundImage: 'var(--toggle-knob)', boxShadow: 'inset 0px 1px 2px 0px rgba(109,103,85,0.25)' }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.img
              key={theme}
              src={isDark ? sun : moon}
              alt=""
              className="size-[14px]"
              initial={reduce ? { opacity: 0 } : { opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            />
          </AnimatePresence>
        </span>
      </button>
    </motion.div>
  )
}
