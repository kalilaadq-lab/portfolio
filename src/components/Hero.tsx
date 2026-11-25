import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import connectIcon from '../assets/icons/connect.svg'
import copyIcon from '../assets/icons/copy.svg'
import fileIcon from '../assets/icons/file.svg'
import profile from '../assets/img/profile.png'
import { buildSequences, heroSlots } from '../data/stickers'
import { LINKEDIN_URL, NEW_TAB } from '../lib/links'
import { EMAIL, useCopy } from '../lib/useCopy'
import { GlossyButton } from './GlossyButton'
import { Sticker } from './Sticker'

const EASE = [0.23, 1, 0.32, 1] as const

// Open CV destination still to be wired up.
const ACTIONS: { label: string; icon: string; href?: string }[] = [
  { label: 'Copy', icon: copyIcon },
  { label: 'Open CV', icon: fileIcon },
  { label: 'LinkedIn', icon: connectIcon, href: LINKEDIN_URL },
]

const ACTION_CLASS =
  'pressable flex cursor-pointer items-center justify-center gap-1.5 px-3 py-2.5 text-[13px] leading-[15.6px] font-medium'

export function Hero() {
  const reduce = useReducedMotion()
  // One random mapping per page load.
  const [sequences] = useState(buildSequences)

  const item = (i: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 12, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 0.6, ease: EASE, delay: 0.05 + i * 0.07 },
  })

  return (
    <section id="top" className="relative mx-auto w-full max-w-[1280px] px-2">
      {/* Sticker layer — positions are % of the 1280 × 900 Figma hero frame */}
      <div className="pointer-events-none absolute inset-x-2 inset-y-0">
        {heroSlots.map((slot, i) => (
          <Sticker key={slot.id} slot={slot} sequence={sequences[slot.id]} index={i} />
        ))}
      </div>

      <div className="relative flex min-h-[780px] flex-col items-center justify-start gap-8 pt-[137px] pb-[136px] sm:min-h-[900px] sm:justify-center sm:py-20">
        <motion.img
          {...item(0)}
          src={profile}
          alt="Kalila Daquayza"
          className="size-[60px] rounded-full object-cover"
        />

        <div className="flex flex-col items-center gap-4">
          <div className="flex w-full max-w-[560px] flex-col items-center text-center">
            <motion.p {...item(1)} className="mb-[7px] text-2xl leading-[28.8px] tracking-[-0.72px]">
              I’m
            </motion.p>

            <motion.h1 {...item(2)} className="relative px-[5px] text-2xl leading-[28.8px] font-normal tracking-[-0.72px]">
              <NameSelection />
              <span className="relative">Kalila Daquayza</span>
            </motion.h1>

            <motion.div {...item(3)} className="mt-[18px]">
              <div
                className="flex items-center overflow-hidden rounded-full"
                style={{ background: 'var(--pill-bg)', boxShadow: 'var(--pill-shadow)' }}
              >
                {ACTIONS.map((a, i) => (
                  <div key={a.label} className="flex items-center">
                    {i > 0 && <span aria-hidden className="h-5 w-px" style={{ background: 'var(--pill-divider)' }} />}
                    {a.label === 'Copy' ? (
                      <CopyButton />
                    ) : a.href ? (
                      <a href={a.href} {...NEW_TAB} className={ACTION_CLASS}>
                        <img src={a.icon} alt="" width={18} height={18} className="theme-icon size-[18px]" />
                        {a.label}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      <button type="button" className={ACTION_CLASS}>
                        <img src={a.icon} alt="" width={18} height={18} className="theme-icon size-[18px]" />
                        {a.label}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.p {...item(4)} className="mt-[15px] text-2xl leading-[28.8px] tracking-[-0.72px]">
              I design digital experiences
            </motion.p>
          </div>

          <motion.div
            {...item(5)}
            className="flex w-[300px] max-w-full flex-col gap-4 text-center font-inter text-[15.5px] leading-[22.4px] tracking-[-0.48px] text-fg-muted"
          >
            <p>I’m a UI/UX Designer focused on creating intuitive digital experiences that solve real user problems.</p>
            <p>My experience spans HRIS, IoT, education, and other digital products across both B2B and B2C industries.</p>
          </motion.div>
        </div>

        <motion.div {...item(6)} className="flex flex-wrap items-center justify-center gap-3">
          <GlossyButton href="#contact" magnetic>
            Get in touch
          </GlossyButton>
          <GlossyButton href="#works" variant="primary" magnetic>
            Works
          </GlossyButton>
        </motion.div>
      </div>
    </section>
  )
}

/** "Copy" action: copies the email and swaps its icon to a green check for 2s, then back. */
function CopyButton() {
  const reduce = useReducedMotion()
  const { copied, copy } = useCopy(EMAIL)

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy email address ${EMAIL}`}
      className="pressable flex cursor-pointer items-center justify-center gap-1.5 px-3 py-2.5 text-[13px] leading-[15.6px] font-medium"
    >
      <span className="relative size-[18px]">
        <AnimatePresence initial={false}>
          {copied ? (
            // Check: pops in on a spring while its tick draws itself like a pen stroke.
            // Green (#37A16F) from the Figma "check" icon, so no dark-mode invert.
            <motion.svg
              key="check"
              viewBox="0 0 18 18"
              fill="none"
              className="absolute inset-0 size-[18px]"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, filter: 'blur(2px)' }}
              transition={
                reduce ? { duration: 0.15 } : { type: 'spring', duration: 0.4, bounce: 0.45 }
              }
            >
              <motion.path
                d="M3.75 9.9444L5.68937 11.9676C6.18938 12.4892 6.43937 12.75 6.75003 12.75C7.06069 12.75 7.31069 12.4892 7.81072 11.9676L14.25 5.25"
                stroke="#37A16F"
                strokeWidth={1.125}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.35, ease: EASE, delay: 0.06 }}
              />
            </motion.svg>
          ) : (
            // Copy icon: spins out when copying, spins back in when the check expires.
            // The wrapper animates (incl. blur filter) so the <img> keeps its dark-mode invert filter.
            <motion.span
              key="copy"
              className="absolute inset-0 size-[18px]"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: 45, filter: 'blur(2px)' }}
              animate={{ opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)' }}
              exit={
                reduce
                  ? { opacity: 0, transition: { duration: 0.12 } }
                  : { opacity: 0, scale: 0.6, rotate: -45, filter: 'blur(2px)', transition: { duration: 0.15, ease: EASE } }
              }
              transition={reduce ? { duration: 0.15 } : { type: 'spring', duration: 0.4, bounce: 0.3 }}
            >
              <img src={copyIcon} alt="" width={18} height={18} className="theme-icon block size-[18px]" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      Copy
      <span className="sr-only" aria-live="polite">
        {copied ? 'Copied' : ''}
      </span>
    </button>
  )
}

/** Pink "text selection" box with handles around the name — draws in once on load. */
function NameSelection() {
  const reduce = useReducedMotion()
  return (
    <motion.span
      aria-hidden
      className="absolute inset-0 origin-left"
      // Negative insets keep the round handles (which sit outside the box) visible.
      initial={reduce ? { opacity: 0 } : { clipPath: 'inset(-20px 100% -20px -20px)' }}
      animate={reduce ? { opacity: 1 } : { clipPath: 'inset(-20px -20px -20px -20px)' }}
      transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1], delay: 0.55 }}
    >
      <span className="absolute inset-0 bg-accent-soft" />
      <span className="absolute inset-y-0 left-0 w-[2px] bg-accent" />
      <span className="absolute inset-y-0 right-0 w-[2px] bg-accent" />
      <span className="absolute top-[-14px] left-[-7px] size-[15px] rounded-full bg-accent" />
      <span className="absolute right-[-6px] bottom-[-14px] size-[15px] rounded-full bg-accent" />
    </motion.span>
  )
}
