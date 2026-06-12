import { create } from 'zustand'

/**
 * Global app state. Zustand is used (instead of React context/useState) because
 * it can be read inside useFrame / imperative handlers via useStore.getState()
 * without triggering React re-renders.
 */
export const useStore = create((set, get) => ({
  // (state shape below; dev console access via window.__store at file bottom)
  // ---- Camera view ----------------------------------------------------------
  // Which named preset (see scene/views.js) the camera is animating toward.
  currentView: 'room',
  setView: (view) => set({ currentView: view }),

  // ---- Hover (drives the outline effect / cursor) ---------------------------
  hoveredId: null,
  setHovered: (id) => set({ hoveredId: id }),

  // ---- Intro / load gating --------------------------------------------------
  sceneLoaded: false,
  setSceneLoaded: (v = true) => set({ sceneLoaded: v }),

  introDone: false,
  // Called by the intro "Enter" button. The click is also what unlocks browser
  // audio autoplay, so we start the music here.
  enter: () => {
    set({ introDone: true })
    get().playMusic()
  },

  // ---- TV clip player --------------------------------------------------------
  // tvOn flips true on the first TV activation so the <video> elements are only
  // created (and bytes fetched) once someone actually looks at the TV.
  tvOn: false,
  tvClipIndex: 0,
  tvActivate: () => set({ tvOn: true }),
  tvAdvance: (count) =>
    set((s) => ({ tvClipIndex: (s.tvClipIndex + 1) % count })),

  // ---- Monitor A (IDE) -------------------------------------------------------
  // Boot plays in full only the first time the monitor1 view is entered.
  ideBooted: false,
  setIdeBooted: () => set({ ideBooted: true }),

  // ---- Audio ----------------------------------------------------------------
  isMusicPlaying: false,
  _audio: null, // the <audio> element, registered by <AudioController/>
  registerAudio: (el) => set({ _audio: el }),

  playMusic: () => {
    const el = get()._audio
    if (!el) return
    el.play().then(() => set({ isMusicPlaying: true })).catch(() => {})
  },

  toggleMusic: () => {
    const el = get()._audio
    if (!el) return
    if (get().isMusicPlaying) {
      el.pause()
      set({ isMusicPlaying: false })
    } else {
      el.play().then(() => set({ isMusicPlaying: true })).catch(() => {})
    }
  },
}))

// Dev-only: poke at state from the browser console (window.__store.getState()).
if (import.meta.env.DEV) window.__store = useStore
