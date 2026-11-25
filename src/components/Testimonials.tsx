import { motion, useReducedMotion, type PanInfo } from 'motion/react'
import { useState, type KeyboardEvent } from 'react'
import { Reveal } from './Reveal'

/** `avatar` is optional — without it the card shows the first-name initial. */
type Review = { company: string; quote: string; name: string; role: string; avatar?: string }

// Testimonials from the FigJam table (Name / Job + Company / Testimony).
const REVIEWS: Review[] = [
  {
    company: 'Dibimbing.id',
    quote: 'Kalila has a sharp eye for detail and aesthetics. She consistently delivers thoughtful, user-centered designs and is always open to feedback, quick to iterate, and full of fresh ideas.',
    name: 'Fachril Zulfidar',
    role: 'UIUX Designer at Dibimbing.id',
  },
  {
    company: 'PT Maha Akbar Sejahtera',
    quote: 'Working with her is always a smooth experience. She understands ideas quickly, collaborates effortlessly, and brings a thoughtful approach and clean design sense to project.',
    name: 'Kelliyos Antoni',
    role: 'UIUX Designer at Maha Akbar',
  },
  {
    company: 'PT Bank Rakyat Indonesia (BRI)',
    quote: 'What stands out most is her ability to combine strong UX thinking with implementation-ready designs. Her structured workflow and clear communication make collaboration with developers seamless.',
    name: 'Nur Alimul Haq',
    role: 'Backend Developer at BRI',
  },
  {
    company: 'PT Maha Akbar Sejahtera',
    quote: 'Kalila turns product goals into clear, intuitive user flows. She asks the right questions, communicates design decisions clearly, and consistently delivers on time. A dependable teammate who elevates every project.',
    name: 'Muhammad Zuhdi',
    role: 'Flutter Developer at Maha Akbar',
  },
]

/** Initial-letter avatar, styled like the "A" avatar in the Figma design. */
function Avatar({ name, src }: { name: string; src?: string }) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        draggable={false}
        className="size-[35.36px] shrink-0 rounded-full object-cover"
        style={{ background: 'var(--avatar-bg)' }}
      />
    )
  }
  return (
    <span
      aria-hidden
      className="flex size-[35.36px] shrink-0 items-center justify-center rounded-full bg-[#2a2b38] font-inter text-[13px] leading-none text-white"
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  )
}

const GOLD =
  'linear-gradient(94.66deg, rgb(148,98,30) 0%, rgb(255,240,179) 22%, rgb(188,129,31) 43%, rgb(255,248,218) 58%, rgb(168,108,25) 80%, rgb(232,189,96) 100%)'

// Side cards in Figma are 316.8 wide vs 374.4 for the centre card, rotated ±2°,
// centred 338.4px from the middle (= 90.4% of the card width).
const SIDE_SCALE = 316.8 / 374.4

export function Testimonials() {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  const n = REVIEWS.length
  const go = (i: number) => setActive(((i % n) + n) % n)

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const swipe = info.offset.x
    const v = info.velocity.x
    if (swipe < -60 || v < -400) go(active + 1)
    else if (swipe > 60 || v > 400) go(active - 1)
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(active + 1)
    if (e.key === 'ArrowLeft') go(active - 1)
  }

  return (
    <section aria-roledescription="carousel" aria-label="Reviews" className="overflow-hidden px-4 pt-6 pb-[104px] sm:px-10 lg:px-40">
      <Reveal className="mx-auto max-w-[1120px]">
        <div
          tabIndex={0}
          onKeyDown={onKey}
          className="relative h-[414px] outline-none"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
          }}
        >
          {REVIEWS.map((r, i) => {
            const offset = (i - active + n) % n
            const pos = offset === 0 ? 0 : offset === 1 ? 1 : offset === n - 1 ? -1 : 0
            const isCenter = offset === 0
            const hidden = !isCenter && pos === 0

            return (
              <motion.article
                key={r.name}
                aria-roledescription="slide"
                aria-label={`Review ${i + 1} of ${n}, ${r.name}`}
                aria-hidden={!isCenter}
                onClick={() => !isCenter && go(i)}
                drag={isCenter ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={onDragEnd}
                initial={false}
                animate={{
                  x: `calc(-50% + ${pos * 90.4}%)`,
                  y: isCenter ? '-50%' : 'calc(-50% + 9px)',
                  scale: isCenter ? 1 : SIDE_SCALE,
                  rotate: reduce ? 0 : pos * 2,
                  opacity: hidden ? 0 : 1,
                }}
                transition={reduce ? { duration: 0 } : { type: 'spring', duration: 0.6, bounce: 0.18 }}
                className={`absolute top-1/2 left-1/2 flex h-[293.28px] w-[min(374.4px,84vw)] flex-col gap-[14.6px] overflow-hidden rounded-[20px] border p-[22.92px] select-none ${
                  isCenter ? 'z-20 cursor-grab active:cursor-grabbing' : 'z-10 cursor-pointer'
                }`}
                style={{
                  background: isCenter ? 'var(--card-bg-active)' : 'var(--card-bg)',
                  borderColor: 'var(--card-border)',
                  boxShadow: isCenter
                    ? '0px 2px 5px 0px rgba(20,24,32,0.1), 0px 18px 42px 0px rgba(20,24,32,0.12)'
                    : '0px 1px 3px 0px rgba(20,24,32,0.07), 0px 10px 28px 0px rgba(20,24,32,0.08)',
                  transition: 'background-color 300ms ease',
                }}
              >
                <header className="flex items-center justify-between gap-4 text-[12.5px] leading-[14.976px] tracking-[-0.25px]">
                  <span>{r.company}</span>
                  <span
                    aria-label="5 out of 5 stars"
                    className="bg-clip-text text-[13.5px] leading-[13.52px] tracking-[1px] text-transparent"
                    style={{ backgroundImage: GOLD }}
                  >
                    ★★★★★
                  </span>
                </header>
                <blockquote className="flex-1 font-inter text-[18.4px] leading-[24.336px] tracking-[-0.6552px]">
                  “{r.quote}”
                </blockquote>
                <footer
                  className="flex items-center gap-[10.4px] border-t pt-[13.56px]"
                  style={{ borderColor: 'var(--card-divider)' }}
                >
                  <Avatar name={r.name} src={r.avatar} />
                  <div className="flex flex-col gap-[2px] text-[12.5px] leading-[14.976px] tracking-[-0.12px]">
                    <span className="tracking-[-0.25px]">{r.name}</span>
                    <span className="text-fg-muted">{r.role}</span>
                  </div>
                </footer>
              </motion.article>
            )
          })}
        </div>

        <div role="group" aria-label="Choose a review" className="flex min-h-11 items-center justify-center pb-[2px]">
          {REVIEWS.map((r, i) => (
            <button
              key={r.name}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show review ${i + 1}`}
              aria-current={i === active}
              className="flex h-11 w-5 cursor-pointer items-center justify-center"
            >
              <motion.span
                className="block h-[6px] rounded-full"
                animate={{ width: i === active ? 14 : 6 }}
                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                style={{ background: i === active ? 'var(--dot-active)' : 'var(--dot)' }}
              />
            </button>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
