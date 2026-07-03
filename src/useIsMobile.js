import { useSyncExternalStore } from 'react'

/**
 * Small-screen / touch detection for the handful of mobile-only tweaks
 * (renderer pixel-ratio cap, skipping the hover-outline pass). Width-based so
 * it's easy to test with devtools/viewport emulation; covers phones in both
 * orientations (landscape phones are ~932px wide at most).
 */
const QUERY = '(max-width: 932px)'

function subscribe(onChange) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches
}

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
