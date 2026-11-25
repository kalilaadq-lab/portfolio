import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import type { CSSProperties } from 'react'
import { HERO_H, HERO_MH, HERO_MW, HERO_W, type HeroSlot, type StickerArt } from '../data/stickers'

type Props = {
  slot: HeroSlot
  /** [original, swap1, …, swap5] — click advances, then wraps back to the original */
  sequence: StickerArt[]
  /** stagger index for the entrance animation */
  index: number
}

const pct = (v: number, of: number) => `${(v / of) * 100}%`

export function Sticker({ slot, sequence, index }: Props) {
  const [step, setStep] = useState(0)
  const reduce = useReducedMotion()
  const art = sequence[step]

  // Alternate the spin direction per click so consecutive swaps feel hand-flicked.
  const spin = step % 2 === 0 ? 14 : -14

  return (
    <motion.button
      type="button"
      onClick={() => setStep((s) => (s + 1) % sequence.length)}
      aria-label={`${slot.label} sticker — click to swap (${step + 1}/${sequence.length})`}
      className="sticker pointer-events-auto absolute z-10 cursor-pointer select-none [-webkit-tap-highlight-color:transparent]"
      // Desktop vs mobile placement is switched in CSS (.sticker in index.css).
      style={
        {
          '--x': pct(slot.x, HERO_W),
          '--y': pct(slot.y, HERO_H),
          '--w': `clamp(${Math.round(slot.w * 0.6)}px, ${pct(slot.w, HERO_W)}, ${slot.w}px)`,
          '--ar': `${slot.w} / ${slot.h}`,
          '--mx': slot.m ? pct(slot.m.x, HERO_MW) : '0',
          '--my': slot.m ? pct(slot.m.y, HERO_MH) : '0',
          '--mw': slot.m ? pct(slot.m.w, HERO_MW) : '0',
          '--mar': slot.m ? `${slot.m.w} / ${slot.m.h}` : '1',
          '--mdisplay': slot.m ? 'block' : 'none',
          containerType: 'size',
        } as CSSProperties
      }
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', duration: 0.7, bounce: 0.25, delay: 0.25 + index * 0.06 }}
      whileTap={reduce ? undefined : { scale: 0.92 }}
    >
      <span className="sticker-hover absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={step}
            className="relative block"
            style={{
              // Fit the art's own box inside the slot (contain), keeping its aspect ratio.
              aspectRatio: `${art.w} / ${art.h}`,
              width: `min(100cqw, calc(100cqh * ${art.w / art.h}))`,
            }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: -spin, filter: 'blur(6px)' }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
              filter: 'blur(0px)',
              transition: reduce ? { duration: 0.2, ease: 'easeOut' } : { type: 'spring', duration: 0.5, bounce: 0.4 },
            }}
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.15 } }
                : {
                    opacity: 0,
                    scale: 0.7,
                    rotate: spin,
                    filter: 'blur(6px)',
                    transition: { duration: 0.16, ease: [0.23, 1, 0.32, 1] },
                  }
            }
          >
            <Art art={art} />
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.button>
  )
}

/** Renders a sticker exactly like its Figma layer: rotated inner frame + cropped image. */
function Art({ art }: { art: StickerArt }) {
  const image = art.crop ? (
    <img
      src={art.src}
      alt=""
      draggable={false}
      className="pointer-events-none absolute max-w-none"
      style={{
        width: `${art.crop.w}%`,
        height: `${art.crop.h}%`,
        left: `${art.crop.left}%`,
        top: `${art.crop.top}%`,
      }}
    />
  ) : (
    <img src={art.src} alt="" draggable={false} className="pointer-events-none absolute inset-0 size-full object-cover" />
  )

  if (!art.inner) {
    return <span className="absolute inset-0 overflow-hidden">{image}</span>
  }

  return (
    <span className="absolute inset-0 flex items-center justify-center">
      <span
        className="relative block shrink-0 overflow-hidden"
        style={{
          width: `${(art.inner.w / art.w) * 100}%`,
          height: `${(art.inner.h / art.h) * 100}%`,
          transform: `rotate(${art.inner.rotate}deg)`,
        }}
      >
        {image}
      </span>
    </span>
  )
}
