// The 18 images from the Figma "asset support" section (transparent PNG fills).
const files = import.meta.glob<string>('../assets/stickers/s*.png', {
  eager: true,
  import: 'default',
})
const img = (n: string) => files[`../assets/stickers/${n}.png`]

/**
 * How Figma lays out each image: an outer bounding box (w × h), optionally a rotated
 * inner frame, and an optional crop of the image inside that frame (% values straight
 * from get_design_context). Without a crop the image is `object-cover`.
 */
export type StickerArt = {
  id: string
  src: string
  w: number
  h: number
  inner?: { w: number; h: number; rotate: number }
  crop?: { w: number; h: number; left: number; top: number }
}

export const stickers: StickerArt[] = [
  { id: 's01', src: img('s01'), w: 110, h: 114, crop: { w: 121.15, h: 117.2, left: -9.18, top: -9.43 } },
  { id: 's02', src: img('s02'), w: 115.05, h: 115.05, inner: { w: 100, h: 100, rotate: 9.44 } },
  {
    id: 's03',
    src: img('s03'),
    w: 148.74,
    h: 152.83,
    inner: { w: 130, h: 134.877, rotate: -8.61 },
    crop: { w: 131.49, h: 126.73, left: -16.39, top: -10.33 },
  },
  { id: 's04', src: img('s04'), w: 124.26, h: 124.26, inner: { w: 115, h: 115, rotate: -4.82 } },
  { id: 's05', src: img('s05'), w: 160, h: 116 },
  { id: 's06', src: img('s06'), w: 142.82, h: 142.82 },
  { id: 's07', src: img('s07'), w: 130, h: 130 },
  { id: 's08', src: img('s08'), w: 110, h: 117 },
  { id: 's09', src: img('s09'), w: 125.62, h: 99.01 },
  { id: 's10', src: img('s10'), w: 163.75, h: 163.75 },
  { id: 's11', src: img('s11'), w: 130, h: 130 },
  { id: 's12', src: img('s12'), w: 175.09, h: 175.09 },
  { id: 's13', src: img('s13'), w: 150, h: 150 },
  { id: 's14', src: img('s14'), w: 130, h: 130 },
  { id: 's15', src: img('s15'), w: 169.5, h: 169.5 },
  { id: 's16', src: img('s16'), w: 168.17, h: 168.17 },
  {
    id: 's17',
    src: img('s17'),
    w: 152.79,
    h: 145.26,
    inner: { w: 120, h: 104.625, rotate: -24.76 },
    crop: { w: 100, h: 114.7, left: 0, top: -7.01 },
  },
  { id: 's18', src: img('s18'), w: 99, h: 110, crop: { w: 144.81, h: 129.98, left: -14.71, top: -14.7 } },
]

const byId = (id: string) => stickers.find((s) => s.id === id)!

/**
 * Hero sticker slots. Positions/sizes are from the Figma hero section (1280 × 900),
 * expressed as % of that box so they stay proportional on smaller screens.
 */
export type HeroSlot = {
  id: string
  label: string
  original: StickerArt
  x: number
  y: number
  w: number
  h: number
  /** Mobile position from the Figma "390w" frame (390 × 780 hero); omitted = hidden on mobile */
  m?: { x: number; y: number; w: number; h: number }
}

export const HERO_W = 1280
export const HERO_H = 900
export const HERO_MW = 390
export const HERO_MH = 780

export const heroSlots: HeroSlot[] = [
  { id: 'star', label: 'Star', original: byId('s03'), x: 64.26, y: 101.83, w: 148.74, h: 152.83, m: { x: 30, y: 111.55, w: 88.22, h: 90.65 } },
  { id: 'tomato', label: 'Tomato', original: byId('s04'), x: 713.33, y: 51, w: 124.26, h: 124.26, m: { x: 163, y: 27.73, w: 86.55, h: 86.45 } },
  { id: 'bag', label: 'Gingham bag', original: byId('s18'), x: 282.33, y: 325, w: 99, h: 110 },
  { id: 'cat', label: 'Green cat', original: byId('s05'), x: 1020.33, y: 226, w: 160, h: 116, m: { x: 265, y: 122, w: 110, h: 80 } },
  { id: 'cd', label: 'CD case', original: byId('s17'), x: 141.79, y: 591.46, w: 152.79, h: 145.26, m: { x: 22, y: 660.63, w: 102.22, h: 97.19 } },
  { id: 'tamagotchi', label: 'Tamagotchi', original: byId('s02'), x: 936.33, y: 646, w: 115.05, h: 115.05, m: { x: 310.49, y: 670, w: 80.54, h: 80.54 } },
]

/** Max number of swaps before a sticker cycles back to its original image. */
export const MAX_SWAPS = 5

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Random mapping, generated once per page load: each slot gets its own sequence of
 * MAX_SWAPS different images (never its own original). Click 1..5 walks the
 * sequence, click 6 returns to the original, then it repeats.
 */
export function buildSequences(): Record<string, StickerArt[]> {
  const out: Record<string, StickerArt[]> = {}
  for (const slot of heroSlots) {
    out[slot.id] = [slot.original, ...shuffle(stickers.filter((s) => s !== slot.original)).slice(0, MAX_SWAPS)]
  }
  return out
}
