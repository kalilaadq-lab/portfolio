import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import type { ComponentPropsWithoutRef, PointerEvent, ReactNode } from 'react'

type Variant = 'silver' | 'primary'

type Props = {
  variant?: Variant
  /** 'pill' = 50px text button, 'icon' = 44px round social button */
  shape?: 'pill' | 'icon'
  /** Button drifts toward the cursor while hovered (mouse only). */
  magnetic?: boolean
  children: ReactNode
} & ComponentPropsWithoutRef<'a'>

// How far the button / its label follow the cursor (fraction of cursor offset from centre).
const PULL = 0.3
const LABEL_PULL = 0.14
// Soft, slightly springy follow; interruptible so it never "snaps".
const SPRING = { stiffness: 220, damping: 18, mass: 0.6 }

/**
 * The glossy "Aqua/Mercury" button from the Figma design: soft colored glow underneath,
 * vertical gradient body, top reflection and inset highlights. Colors come from CSS
 * variables (see index.css) so the same component works in light and dark themes.
 */
export function GlossyButton({
  variant = 'silver',
  shape = 'pill',
  magnetic = false,
  children,
  className = '',
  onPointerMove,
  onPointerLeave,
  ...rest
}: Props) {
  const isIcon = shape === 'icon'
  const v = variant === 'primary' ? 'primary' : 'silver'
  const reduce = useReducedMotion()
  const active = magnetic && !reduce

  // The <a> itself stays put (stable hit area); only the visual layers move.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, SPRING)
  const y = useSpring(my, SPRING)
  const lx = useSpring(useMotionValue(0), SPRING)
  const ly = useSpring(useMotionValue(0), SPRING)

  const handleMove = (e: PointerEvent<HTMLAnchorElement>) => {
    onPointerMove?.(e)
    if (!active || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    mx.set(dx * PULL)
    my.set(dy * PULL)
    lx.set(dx * LABEL_PULL)
    ly.set(dy * LABEL_PULL)
  }

  const handleLeave = (e: PointerEvent<HTMLAnchorElement>) => {
    onPointerLeave?.(e)
    mx.set(0)
    my.set(0)
    lx.set(0)
    ly.set(0)
  }

  return (
    <a
      {...rest}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`glossy pressable relative inline-flex shrink-0 items-center justify-center rounded-full ${
        isIcon ? 'size-11' : 'h-[50px]'
      } ${className}`}
    >
      <motion.span className="relative flex items-center justify-center" style={active ? { x, y } : undefined}>
        {/* Glow */}
        <span
          aria-hidden
          className="glossy-glow pointer-events-none absolute rounded-[200px] blur-[4.5px]"
          style={{
            inset: isIcon ? '7px 2px 1px 2px' : '10px 0 5px 0',
            backgroundImage: `linear-gradient(to bottom, var(--${v}-glow-from), var(--${v}-glow-via) 50%, var(--${v}-glow-to))`,
            opacity: `var(--${v}-glow-opacity)`,
            boxShadow: `var(--${v}-glow-shadow)`,
          }}
        />
        {/* Body */}
        <span
          className={`relative flex items-center justify-center overflow-hidden rounded-full ${
            isIcon ? 'size-11' : 'h-[50px] px-7'
          }`}
          style={{
            backgroundImage: `linear-gradient(to bottom, var(--${v}-from), var(--${v}-via) var(--${v}-via-stop), var(--${v}-to))`,
            boxShadow: `var(--${v}-inset)`,
          }}
        >
          <motion.span
            className={`relative ${isIcon ? 'flex size-6 items-center justify-center' : 'text-[22px] leading-[22px] opacity-90'}`}
            style={{
              ...(isIcon ? {} : { color: `var(--${v}-fg)`, textShadow: `var(--${v}-text-shadow)` }),
              ...(active ? { x: lx, y: ly } : {}),
            }}
          >
            {children}
          </motion.span>
          {/* Reflection */}
          <span
            aria-hidden
            className="pointer-events-none absolute top-[2px] right-[1%] left-[-1%] rounded-[48px]"
            style={{
              height: isIcon ? 18 : 26,
              backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0), var(--${v}-reflection))`,
            }}
          />
        </span>
      </motion.span>
    </a>
  )
}
