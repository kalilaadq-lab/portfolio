import { motion, useReducedMotion, type Transition } from 'motion/react'
import { useState } from 'react'
import frontPanel from '../assets/about/folder-front-open.svg'
import groundShadow from '../assets/about/folder-shadow.svg'
import toolAlien from '../assets/about/tool-alien.png'
import toolFigma from '../assets/about/tool-figma.png'
import toolFramer from '../assets/about/tool-framer.png'

/**
 * Figma "Toolkit Folder" (State=Closed / State=Open), 399.67 × 436.
 * Each logo sits at its Closed box; the Open pose is expressed as a transform
 * (centre offset, size ratio, rotation) so Motion can spring between the two.
 */
const LOGOS = [
  // Painted back → front, same order as the Figma layers.
  { src: toolFramer, left: 160, top: 153, size: 216, open: { x: 57.36, y: -118.95, scale: 1.0658, rotate: 7.43 }, delay: 0.05 },
  { src: toolFigma, left: 26, top: 161, size: 200, open: { x: -26.07, y: -116.4, scale: 1.2138, rotate: -14.96 }, delay: 0 },
  { src: toolAlien, left: 100, top: 131, size: 200, open: { x: 10.97, y: -138.96, scale: 1.0822, rotate: 4.51 }, delay: 0.1 },
]

// Front panel outline from the Figma SVG — reused as the clip for the frosted-glass blur,
// because a backdrop-filter inside an <img> SVG can't blur the page behind it.
const PANEL_PATH =
  'M31.4962 10H237.403C247.698 10 253.876 14 260.053 21L286.821 52C292.998 59 299.175 62 309.471 62H344.475C353.74 62 359.918 69 358.888 78L347.563 188C346.534 196 339.327 202 331.091 202H44.8802C36.6439 202 29.4371 196 28.4076 188L18.1123 26C17.0827 17 23.2599 10 31.4962 10Z'

// Open: lively spring with a little overshoot. Close: quicker, no bounce, no stagger.
const OPEN: Transition = { type: 'spring', duration: 0.6, bounce: 0.32 }
const CLOSE: Transition = { type: 'spring', duration: 0.38, bounce: 0 }
const PEEK: Transition = { type: 'spring', duration: 0.4, bounce: 0.2 }

export function ToolkitFolder({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState(false)

  return (
    <motion.button
      type="button"
      aria-expanded={open}
      aria-label={open ? 'Close my toolkit folder' : 'Open my toolkit folder'}
      onClick={() => setOpen((o) => !o)}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
      onPointerLeave={() => setHover(false)}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', duration: 0.25, bounce: 0 }}
      className={`absolute h-[436px] w-[399.67px] cursor-pointer rounded-[24px] [-webkit-tap-highlight-color:transparent] ${className}`}
    >
      {/* Ground shadow */}
      <img alt="" src={groundShadow} className="pointer-events-none absolute top-[370px] left-[40.99px] h-[50px] w-[318px] max-w-none" />

      {/* Back panel */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-[160px] left-[48px] h-[226px] w-[304px] rounded-[20px] border border-[rgba(242,79,166,0.55)] bg-gradient-to-b from-[#ff9bd0] to-[#fe60b4] shadow-[inset_0px_-6px_14px_0px_rgba(224,65,143,0.35),inset_0px_2px_2px_0px_rgba(255,255,255,0.55)]"
      />

      {/* Logos */}
      {LOGOS.map((l) => {
        const pose = open ? l.open : hover && !reduce ? { x: 0, y: -10, scale: 1, rotate: 0 } : { x: 0, y: 0, scale: 1, rotate: 0 }
        return (
          <motion.img
            key={l.src}
            alt=""
            src={l.src}
            draggable={false}
            className="pointer-events-none absolute max-w-none"
            style={{ left: l.left, top: l.top, width: l.size, height: l.size }}
            initial={false}
            animate={pose}
            transition={reduce ? { duration: 0 } : open ? { ...OPEN, delay: l.delay } : hover ? PEEK : CLOSE}
          />
        )
      })}

      {/* Front panel — frosted glass. Widens slightly when open (Figma: 323 → 341). */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute top-[188px] left-[10.22px] h-[228px] w-[377px]"
        initial={false}
        animate={{ scaleX: open ? 1 : 323 / 341 }}
        transition={reduce ? { duration: 0 } : open ? OPEN : CLOSE}
      >
        <span
          className="absolute inset-0 backdrop-blur-[6.75px]"
          style={{ clipPath: `path('${PANEL_PATH}')` }}
        />
        <img alt="" src={frontPanel} className="absolute inset-0 size-full max-w-none" />
      </motion.span>
    </motion.button>
  )
}
