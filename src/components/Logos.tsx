import aha from '../assets/logos/aha.png'
import datacakra from '../assets/logos/datacakra.png'
import ibimbing from '../assets/logos/ibimbing.png'
import permata from '../assets/logos/permata.png'
import seameo from '../assets/logos/seameo.png'
import { Reveal } from './Reveal'

// Logos are tinted with a CSS mask so the color follows the theme (#b1b1b1 light / #575757 dark).
const LOGOS = [
  { name: 'Permata Indonesia', src: permata, w: 120, h: 40 },
  { name: 'ibimbing', src: ibimbing, w: 125, h: 36 },
  { name: 'Datacakra', src: datacakra, w: 50, h: 50 },
  { name: 'AHA', src: aha, w: 110, h: 40 },
  { name: 'SEAMEO RECFON', src: seameo, w: 50, h: 44 },
]

export function Logos() {
  return (
    <section aria-labelledby="logos-title" className="flex min-h-[140px] flex-col items-center justify-center px-2">
      <Reveal className="flex flex-col items-center gap-4">
        <h2 id="logos-title" className="text-sm leading-[14px] tracking-[-0.56px]">
          Worked with companies like:
        </h2>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-[30px]">
          {LOGOS.map((l) => (
            <li key={l.name}>
              <span
                role="img"
                aria-label={l.name}
                className="block transition-[background-color] duration-300"
                style={{
                  width: l.w,
                  height: l.h,
                  backgroundColor: 'var(--logo-tint)',
                  maskImage: `url("${l.src}")`,
                  WebkitMaskImage: `url("${l.src}")`,
                  maskSize: '100% 100%',
                  WebkitMaskSize: '100% 100%',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                }}
              />
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
