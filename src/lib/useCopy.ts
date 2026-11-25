import { useEffect, useRef, useState } from 'react'

export const EMAIL = 'kalilaadqyza@gmail.com'

/** Copy `text` to the clipboard and expose a `copied` flag that resets after `ms`. */
export function useCopy(text: string, ms = 2000) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Clipboard can be blocked (permissions / insecure origin); still show feedback.
    }
    setCopied(true)
    // Clicking again restarts the window.
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), ms)
  }

  return { copied, copy }
}
