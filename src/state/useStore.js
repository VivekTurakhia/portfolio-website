import { create } from 'zustand'
import { tracks } from '../data/tracks'
import { movieClips } from '../data/movieClips'

// Fisher-Yates shuffle of [0..n-1] — the play order for one "session" of music.
function shuffleIndices(n) {
  const a = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Global app state. Zustand is used (instead of React context/useState) because
 * it can be read inside useFrame / imperative handlers via useStore.getState()
 * without triggering React re-renders.
 */
export const useStore = create((set, get) => ({
  // (state shape below; dev console access via window.__store at file bottom)
  // ---- Camera view & focus sequencing ---------------------------------------
  // `currentView` is the preset the camera animates toward (see scene/views.js).
  // The screen power-on/off animations are sequenced *around* the camera move so
  // it feels real:
  //   - entering a screen: camera flies in, THEN the screen powers on
  //     (gated by `cameraSettled`, set true by CameraRig's spring onRest);
  //   - leaving a monitor: the screen powers off FIRST (`exiting` phase), and
  //     only when that finishes does the camera fly back to the room.
  currentView: 'room',
  cameraSettled: true, // has the camera reached `currentView`?
  exiting: false, // a monitor is playing its power-off before the camera leaves

  setCameraSettled: (v) => set({ cameraSettled: v }),

  // Focus a view. Changing target means the camera starts moving, so it's no
  // longer settled and any pending exit is cancelled.
  setView: (view) =>
    set((s) => (s.currentView === view ? {} : { currentView: view, cameraSettled: false, exiting: false })),

  // Back out of the current focus. Monitors power off first (camera waits);
  // everything else (incl. the TV, which stays on) just flies back immediately.
  leaveView: () => {
    const { currentView, cameraSettled } = get()
    const isMonitor = currentView === 'monitor1' || currentView === 'monitor2'
    if (isMonitor && cameraSettled) set({ exiting: true })
    else set({ currentView: 'room', cameraSettled: false, exiting: false })
  },

  // Called once a monitor's power-off animation has finished — now move camera.
  finishExit: () => set({ currentView: 'room', cameraSettled: false, exiting: false }),

  // ---- Hover (drives the outline effect / cursor) ---------------------------
  hoveredId: null,
  setHovered: (id) => set({ hoveredId: id }),

  // ---- Intro / load gating --------------------------------------------------
  sceneLoaded: false,
  setSceneLoaded: (v = true) => set({ sceneLoaded: v }),

  introDone: false,
  // Music starts off; the speakers are the music control (see below).
  enter: () => set({ introDone: true }),

  // ---- TV clip player --------------------------------------------------------
  // tvOn flips true on the first TV activation so the clip bytes are only fetched
  // once someone looks at the TV. `_tvVideo` is the <video> element (registered
  // by TvScreen); tvActivate kicks playback off *synchronously inside the tap*,
  // which iOS requires — otherwise the film never loads or plays on iPhone.
  tvOn: false,
  tvClipIndex: 0,
  _tvVideo: null,
  registerTvVideo: (el) => set({ _tvVideo: el }),
  tvActivate: () => {
    set({ tvOn: true })
    const v = get()._tvVideo
    if (v) {
      if (!v.src) v.src = movieClips[get().tvClipIndex].src
      v.muted = true // muted autoplay is allowed on iOS; TvScreen unmutes on focus
      const p = v.play()
      if (p && p.catch) p.catch(() => {})
    }
  },
  tvAdvance: (count) =>
    set((s) => ({ tvClipIndex: (s.tvClipIndex + 1) % count })),

  // ---- Monitor A (IDE) -------------------------------------------------------
  // Boot plays in full only the first time the monitor1 view is entered.
  ideBooted: false,
  setIdeBooted: () => set({ ideBooted: true }),

  // ---- Music (speaker playlist) ---------------------------------------------
  // The speakers toggle a shuffled loop of `tracks`. While on, <AudioController>
  // auto-advances on each track's end and wraps back to the start, so it's never
  // silent. Toggling on (re)shuffles and starts from the top of the new order.
  musicOn: false,
  order: shuffleIndices(tracks.length), // current shuffled play order (indices)
  trackIndex: 0, // position within `order`

  toggleMusic: () =>
    set((s) =>
      s.musicOn
        ? { musicOn: false }
        : { musicOn: true, order: shuffleIndices(tracks.length), trackIndex: 0 }
    ),

  // Advance to the next track, looping back to the beginning of the shuffle.
  nextTrack: () => set((s) => ({ trackIndex: (s.trackIndex + 1) % s.order.length })),
}))

// Dev-only: poke at state from the browser console (window.__store.getState()).
if (import.meta.env.DEV) window.__store = useStore
