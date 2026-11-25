import stars from '../data/stars.json'

// Opacities per star size, from the Figma "Stellar Dark Background" layers.
const OPACITY: Record<string, number[]> = {
  '1': [0.6, 0.55, 0.5],
  '1.5': [0.6, 0.5, 0.65, 0.55, 0.7],
  '2': [0.8, 0.7, 0.85, 0.75],
  '2.5': [0.9, 0.85],
}

/** Dark-mode starry backdrop behind the hero (1440 × 781 in the design). Hidden in light mode. */
export function StarField() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[781px] opacity-0 transition-opacity duration-500 dark:opacity-100"
    >
      <svg className="size-full" viewBox="0 0 1440 781" preserveAspectRatio="xMidYMin slice">
        {(stars as [number, number, number, number][]).map(([x, y, d, bright], i) => {
          const r = d / 2
          const opacity = bright ? (d >= 3.5 ? 1 : 0.95) : OPACITY[String(d)]?.[i % OPACITY[String(d)].length] ?? 0.7
          return (
            <circle
              key={i}
              cx={x + r}
              cy={y + r}
              r={r}
              fill="white"
              opacity={opacity}
              className={bright ? 'star-twinkle' : undefined}
              style={bright ? { animationDelay: `${(i % 7) * 0.6}s` } : undefined}
            />
          )
        })}
      </svg>
    </div>
  )
}
