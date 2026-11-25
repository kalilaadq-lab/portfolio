import { EMAIL } from './useCopy'

// External profile links — shared so the hero, nav and footer can't drift apart.
export const LINKEDIN_URL = 'https://www.linkedin.com/in/kalila-daquayza'

// Opens the visitor's mail app; the page itself stays put, so no new tab is needed
// (target="_blank" on mailto: leaves an empty tab behind in some browsers).
export const MAILTO = `mailto:${EMAIL}`

// Props for links that open in a new tab. noopener/noreferrer stop the new page
// from getting a handle back to this tab (window.opener).
export const NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' } as const
