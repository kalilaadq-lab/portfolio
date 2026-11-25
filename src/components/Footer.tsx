import { motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import dribbble from '../assets/icons/dribbble.svg'
import linkedin from '../assets/icons/linkedin.svg'
import pawMaskLeft from '../assets/icons/paw-mask-left.svg'
import pawMaskRight from '../assets/icons/paw-mask-right.svg'
import telegram from '../assets/icons/telegram.svg'
import x from '../assets/icons/x.svg'
import catHead from '../assets/img/cat-head.png'
import catPaws from '../assets/img/cat-paws.png'
import { GlossyButton } from './GlossyButton'

// Social links — URLs to be filled in later.
const SOCIALS = [
  { label: 'Telegram', icon: telegram },
  { label: 'X', icon: x },
  { label: 'LinkedIn', icon: linkedin },
  { label: 'Dribbble', icon: dribbble },
]

const EASE_OUT = [0.23, 1, 0.32, 1] as const
const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const

const ART_W = 1440
const ART_H = 354.42

/** Scale a fixed-size 1440px composition down to the available width. */
function useFitScale(width: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [width])
  return { ref, scale }
}

export function Footer() {
  const { ref, scale } = useFitScale(ART_W)
  const reduce = useReducedMotion()
  const artRef = useRef<HTMLDivElement>(null)
  const inView = useInView(artRef, { once: true, margin: '-60px' })
  const [catHidden, setCatHidden] = useState(false)
  // After the first peek-up, later hide/peek cycles run without the entrance delay.
  const [peeked, setPeeked] = useState(false)

  return (
    <footer id="contact" style={{ background: 'var(--footer-bg)', transition: 'background-color 300ms ease' }}>
      <div ref={ref} className="relative w-full overflow-hidden">
        {/* Name + cat composition, exactly as the Figma "Theme portrait" frame */}
        <div ref={artRef} className="relative mx-auto" style={{ width: ART_W * scale, height: ART_H * scale }}>
          <div
            className="absolute top-0 left-0 origin-top-left"
            style={{ width: ART_W, height: ART_H, transform: `scale(${scale})` }}
          >
            <div
              className="absolute inset-x-0 top-[290.52px] border-t-[0.75px]"
              style={{ borderColor: 'var(--footer-border)' }}
            />

            {/* Figma-style frame selection around the name — draws in left → right */}
            <div className="absolute top-[18.4px] right-[20.11px] left-[20.11px] h-[271.702px]">
              <motion.div
                className="absolute inset-0 border-[1.493px]"
                style={{ borderColor: 'var(--frame-accent)' }}
                initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 100% 0 0)' }}
                animate={inView ? (reduce ? { opacity: 1 } : { clipPath: 'inset(0 0% 0 0)' }) : undefined}
                transition={{ duration: 0.9, ease: EASE_IN_OUT }}
              />
              <motion.div
                aria-hidden
                className="absolute top-[-14.2px] left-[-1.5px] flex items-center gap-[2.66px] py-[1.5px] pr-[3px] pl-[1.9px] text-[8.25px] leading-[10.47px] font-medium"
                style={{ color: 'var(--frame-accent)' }}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : undefined}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <span className="size-[5.235px] rotate-45 border-[0.75px]" style={{ borderColor: 'var(--frame-accent)' }} />
                Frame 357
              </motion.div>
              {/* Name rises from behind the frame's bottom edge */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden pt-[11.43px] pb-[4.2px]">
                <motion.p
                  className="text-[201.75px] leading-[255.093px] font-medium tracking-[-10.2037px] whitespace-nowrap"
                  initial={reduce ? { opacity: 0 } : { y: '100%' }}
                  animate={inView ? (reduce ? { opacity: 1 } : { y: '0%' }) : undefined}
                  transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.2 }}
                >
                  Kalila Daquayza
                </motion.p>
              </div>
            </div>

            {/* Cat paws (masked) — they grip the edge after the head peeks up */}
            <Paw left={496} mask={pawMaskLeft} show={inView} delay={0.85} reduce={!!reduce} />
            <Paw left={590.67} mask={pawMaskRight} show={inView} delay={0.95} reduce={!!reduce} />

            {/* Head: clipped at the table line (y ≈ 292) so it can hide behind it */}
            <div className="pointer-events-none absolute top-0 left-[559px] h-[292px] w-[331px] overflow-hidden">
              <motion.img
                src={catHead}
                alt=""
                className="absolute top-[159.02px] left-0 h-[133px] w-[331px] drop-shadow-[0px_1.5px_0.75px_rgba(0,0,0,0.2)]"
                initial={reduce ? { opacity: 0 } : { y: 133 }}
                animate={
                  reduce
                    ? { opacity: inView ? 1 : 0, y: catHidden ? 66 : 0 }
                    : { y: !inView ? 133 : catHidden ? 66 : 0 }
                }
                transition={
                  reduce
                    ? { duration: 0 }
                    : catHidden
                      ? { type: 'spring', duration: 0.35, bounce: 0 } // duck fast
                      : { type: 'spring', duration: 0.6, bounce: 0.35, delay: inView && !peeked ? 0.6 : 0 } // peek back with a little bounce
                }
                onAnimationComplete={() => inView && setPeeked(true)}
              />
            </div>

            {/* Hover / tap target covering the cat (head + paws) */}
            <button
              type="button"
              aria-label={catHidden ? 'Make the cat peek out' : 'Make the cat hide'}
              className="absolute top-[159px] left-[520px] h-[200px] w-[400px] cursor-pointer rounded-[40px] [-webkit-tap-highlight-color:transparent]"
              onPointerEnter={(e) => e.pointerType === 'mouse' && setCatHidden(true)}
              onPointerLeave={(e) => e.pointerType === 'mouse' && setCatHidden(false)}
              onClick={(e) => {
                // Touch / keyboard: toggle instead of hover.
                if ((e.nativeEvent as PointerEvent).pointerType !== 'mouse') setCatHidden((h) => !h)
              }}
            />
          </div>
        </div>

        <nav aria-label="Social profiles" className="relative flex items-center justify-center gap-5 px-[15px] pb-6">
          {SOCIALS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : undefined}
              transition={{ duration: 0.45, ease: EASE_OUT, delay: 1.0 + i * 0.06 }}
            >
              <GlossyButton href="#" shape="icon" magnetic aria-label={s.label} onClick={(e) => e.preventDefault()}>
                <img src={s.icon} alt="" width={20} height={20} className="theme-icon size-5" />
              </GlossyButton>
            </motion.div>
          ))}
        </nav>
      </div>

      <div
        className="flex flex-wrap items-center justify-center gap-x-4 px-5 pb-1 text-sm"
        style={{ background: 'var(--strip-bg)' }}
      >
        <span className="leading-[21px] text-fg-muted">© 2026</span>
        <a href="#" className="flex min-h-11 min-w-11 items-center justify-center px-1 leading-[19.6px]">
          Privacy
        </a>
      </div>
    </footer>
  )
}

// The shadow lives on an outer wrapper as a drop-shadow, so it follows the masked
// paw shape instead of drawing a straight box edge.
function Paw({ left, mask, show, delay, reduce }: { left: number; mask: string; show: boolean; delay: number; reduce: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute top-[200.56px] h-[163.035px] w-[354.232px] drop-shadow-[0px_1.5px_0.75px_rgba(0,0,0,0.2)]"
      style={{ left }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      animate={show ? { opacity: 1, y: 0 } : undefined}
      transition={reduce ? { duration: 0.2 } : { type: 'spring', duration: 0.55, bounce: 0.3, delay }}
    >
      <div
        className="absolute inset-0"
        style={{
          maskImage: `url("${mask}")`,
          WebkitMaskImage: `url("${mask}")`,
          maskSize: '354.232px 163.035px',
          WebkitMaskSize: '354.232px 163.035px',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
        }}
      >
        <img src={catPaws} alt="" className="absolute inset-0 size-full" />
      </div>
    </motion.div>
  )
}
