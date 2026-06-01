/**
 * Registry of clickable objects in the room.
 *
 * This is the extensibility seam: to make a new object interactive, add an
 * entry here keyed by its id, then wrap that object's meshes in <Interactive id="...">
 * inside Room.jsx. `onSelect` receives the zustand store state, so a behavior is
 * just a function of the available actions (setView, toggleMusic, ...).
 *
 * `label` is currently used for hover affordance / future tooltips.
 */
export const interactables = {
  monitor1: {
    label: 'Experience',
    onSelect: (store) => store.setView('monitor1'),
  },
  speakers1: {
    label: 'Music',
    onSelect: (store) => store.toggleMusic(),
  },
  speakers2: {
    label: 'Music',
    onSelect: (store) => store.toggleMusic(),
  },

  // ---- Examples for later (uncomment + wrap in Room.jsx to enable) ----------
  // monitor2: { label: 'Projects', onSelect: (store) => store.setView('monitor2') },
  // bed:      { label: 'About',    onSelect: (store) => store.setView('bed') },
  // tv:       { label: 'Reel',     onSelect: (store) => store.setView('tv') },
}
