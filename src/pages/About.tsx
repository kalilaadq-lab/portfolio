import { motion, useReducedMotion } from 'motion/react'
import { useEffect, type ReactNode } from 'react'
import profileDark from '../assets/about/profile-dark.png'
import profileLight from '../assets/about/profile.png'
import aiPaintbrush from '../assets/icons/ai-paintbrush.svg'
import brush from '../assets/icons/brush.svg'
import computer from '../assets/icons/computer.svg'
import note from '../assets/icons/note.svg'
import sparkles from '../assets/icons/sparkles.svg'
import students from '../assets/icons/students.svg'
import teamWork from '../assets/icons/team-work.svg'
import workflow from '../assets/icons/workflow-square.svg'
import { GlossyButton } from '../components/GlossyButton'
import { Reveal } from '../components/Reveal'
import { ToolkitFolder } from '../components/ToolkitFolder'
import { EMAIL, useCopy } from '../lib/useCopy'

type Entry = { date: string; icon: string; title: string; org?: string; text: string }

// Copy as in the Figma design for now (placeholder text to be revised later).
const EXPERIENCE: Entry[] = [
  {
    date: 'Apr 2026 — Now',
    icon: aiPaintbrush,
    title: 'UIUX Designer',
    org: 'PT Permata Indo Sejahtera',
    text: 'End-to-end product design for fintech, crypto, iGaming, Web3, and SaaS. At Lunapark, Pixpowder, and Unipaws, designed trading dashboards, onboarding, account systems, internal tools, component libraries, design systems, and complex flows from discovery to release.',
  },
  {
    date: 'Jan — Apr 2026',
    icon: workflow,
    title: 'UIUX Designer',
    org: 'PT Maha Akbar Sejahtera',
    text: 'End-to-end product design for fintech, crypto, iGaming, Web3, and SaaS. At Lunapark, Pixpowder, and Unipaws, designed trading dashboards, onboarding, account systems, internal tools, component libraries, design systems, and complex flows from discovery to release.',
  },
  {
    date: 'Aug — Nov 2025',
    icon: brush,
    title: 'UIUX Designer Intern',
    org: 'Datacakra Solusi Jaganata',
    text: 'Creative direction and multidisciplinary team leadership at Lunapark. Led web, product, identity, and campaign work for Yandex, VK, Wargaming, Severgazbank, EKSMO, and others, owning concepts, reviews, client communication, and design quality.',
  },
  {
    date: 'Sep 2024 — Jun 2025',
    icon: sparkles,
    title: 'UIUX Designer Intern',
    org: 'Dibimbing.id',
    text: 'Graphic design, identities, campaigns, and web with focus on typography, grids, composition, and art direction. Created websites and digital experiences for Suzuki, VK, Haval, Efes, and Sony, progressing from designer to art director.',
  },
  {
    date: 'Feb — Jun 2024',
    icon: computer,
    title: 'Web Administrator & Publication Designer Intern',
    org: 'Seameo Recfon',
    text: 'Redesigned WordPress pages for better visual consistency, managed content updates, created supporting pages with clearer structures, documented development issues, and reviewed designs to maintain overall website coherence.',
  },
]

const EDUCATION: Entry[] = [
  {
    date: '2021 — 2025',
    icon: students,
    title: 'Gunadarma University',
    text: 'Bachelor’s degree in Information Systems (GPA 3.73), with a focus on system analysis, database management, and technology-driven problem solving.',
  },
  {
    date: '2024 — 2028',
    icon: note,
    title: 'LSP Gunadarma University',
    text: 'Completed a System Analyst training program at LSP Gunadarma University, covering 14 units including Software Requirements Analysis and Software Design.',
  },
  {
    date: '2022 — 2023',
    icon: teamWork,
    title: 'Staff of Sports, Arts and Culture',
    text: 'Responsible for managing three work programs of BEM FIKTI Gunadarma University (FIKTI SPACE 2.0, STALK, PEMIRA), including developing program proposals, designing content for social media, and handling sponsor acquisition and location surveys.',
  },
]

const EASE = [0.23, 1, 0.32, 1] as const
const LABEL = 'text-sm leading-[14px] tracking-[-0.56px]'
const BODY = 'font-inter text-base leading-6 tracking-[-0.48px] text-fg-muted'

export function About() {
  const reduce = useReducedMotion()

  useEffect(() => {
    const prev = document.title
    document.title = 'About — Kalila Daquayza'
    return () => {
      document.title = prev
    }
  }, [])

  const item = (i: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 12, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 0.6, ease: EASE, delay: 0.05 + i * 0.07 },
  })

  return (
    <div className="mx-auto flex w-full max-w-[730px] flex-col gap-[120px] overflow-x-clip px-5 pt-[150px] pb-20 sm:px-0 sm:pt-[100px]">
      {/* Intro */}
      <section aria-labelledby="about-title" className="flex w-full max-w-[400px] flex-col items-start gap-4 sm:ml-[165px]">
        <motion.span {...item(0)} className="relative size-10 overflow-hidden rounded-full">
          <img src={profileLight} alt="Kalila Daquayza" className="absolute top-[-7.69%] left-[-7.69%] size-[115.38%] max-w-none dark:hidden" />
          <img src={profileDark} alt="Kalila Daquayza" className="absolute top-[-8.82%] left-[-8.82%] hidden size-[117.65%] max-w-none dark:block" />
        </motion.span>
        <motion.h1
          {...item(1)}
          id="about-title"
          className={`rounded-lg px-2.5 py-1 font-normal ${LABEL}`}
          style={{ background: 'var(--chip-bg)' }}
        >
          About
        </motion.h1>
        <motion.p {...item(2)} className={BODY}>
          I design digital products and lead visual direction with a focus on quality, clarity, and systems thinking. My
          work sits at the intersection of art direction, product design, and implementation, where aesthetics, structure,
          and behaviour are treated as one continuous system.
        </motion.p>
        <motion.p {...item(3)} className={BODY}>
          Over the years, I’ve developed my own AI-augmented design pipelines that extend my practice rather than define
          it. They allow me to explore more deeply, iterate with higher fidelity, and maintain a strong level of craft
          across every stage of the process.
        </motion.p>
        <motion.div {...item(4)} className="max-w-full">
          <EmailButton />
        </motion.div>
      </section>

      {/* My toolkit */}
      <Reveal>
        <section aria-label="My toolkit" className="flex flex-col gap-8 sm:h-[278px] sm:flex-row sm:items-center">
          <h2 className={`w-[133px] shrink-0 font-normal ${LABEL}`}>My toolkit</h2>
          <div className="relative h-[400px] w-full max-w-[400px] sm:h-[220px]">
            {/* Mobile: scaled & centred. Desktop: the Figma "Folder Slot" offset. */}
            <ToolkitFolder className="top-[34px] left-[calc(50%-175.85px)] origin-top-left scale-[0.88] sm:top-[-120.97px] sm:left-[-42.67px] sm:scale-[1.05]" />
          </div>
        </section>
      </Reveal>

      <Timeline label="Experience" entries={EXPERIENCE} />
      <Timeline label="Education" entries={EDUCATION} />
    </div>
  )
}

function Timeline({ label, entries }: { label: string; entries: Entry[] }) {
  return (
    <section aria-label={label} className="flex flex-col gap-[46px]">
      {entries.map((e, i) => (
        <Reveal key={e.title + e.date} delay={0.04}>
          <Row aside={
            <>
              {i === 0 && <h2 className={`font-normal ${LABEL}`}>{label}</h2>}
              <p className={`${LABEL} whitespace-nowrap opacity-40`}>{e.date}</p>
            </>
          }>
            <div className="flex flex-col gap-2.5">
              <h3 className="flex items-center gap-3">
                <img src={e.icon} alt="" width={19} height={19} className="theme-icon size-[19px] shrink-0" />
                <span className="truncate font-inter text-xl leading-6 font-normal tracking-[-0.8px]" title={e.title}>
                  {e.title}
                </span>
              </h3>
              {e.org && <p className={`${LABEL} opacity-40`}>{e.org}</p>}
              <p className={BODY}>{e.text}</p>
            </div>
          </Row>
        </Reveal>
      ))}
    </section>
  )
}

function Row({ aside, children }: { aside: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
      <div className="flex shrink-0 flex-col gap-4 sm:w-[133px]">{aside}</div>
      <div className="w-full min-w-0 sm:max-w-[400px]">{children}</div>
    </div>
  )
}

/** Glossy email pill: click copies the address; the label blurs over to "Copied!" for 2s. */
function EmailButton() {
  const reduce = useReducedMotion()
  const { copied, copy } = useCopy(EMAIL)
  const swap = { duration: reduce ? 0.12 : 0.22, ease: EASE }

  return (
    <GlossyButton
      href={`mailto:${EMAIL}`}
      magnetic
      aria-label={`Copy email address ${EMAIL}`}
      className="max-w-full"
      onClick={(e) => {
        e.preventDefault()
        copy()
      }}
    >
      <span className="relative inline-grid place-items-center whitespace-nowrap">
        <motion.span
          className="col-start-1 row-start-1 text-[clamp(17px,5.4vw,22px)] sm:text-[22px]"
          initial={false}
          animate={copied ? { opacity: 0, y: reduce ? 0 : -8, filter: 'blur(3px)' } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={swap}
        >
          {EMAIL}
        </motion.span>
        <motion.span
          aria-hidden
          className="col-start-1 row-start-1"
          initial={false}
          animate={copied ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: reduce ? 0 : 8, filter: 'blur(3px)' }}
          transition={swap}
        >
          Copied!
        </motion.span>
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Email copied' : ''}
      </span>
    </GlossyButton>
  )
}
