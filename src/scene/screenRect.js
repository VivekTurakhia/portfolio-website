/**
 * Shared, non-reactive holder for the on-screen pixel rect of each monitor's
 * screen face. <ScreenProjector> (inside the Canvas) writes to it every frame by
 * projecting the real 3D screen mesh through the camera; <ScreenOverlay> (DOM)
 * reads it from its own rAF loop. Kept outside React state so per-frame updates
 * don't trigger re-renders.
 *
 * Values are in viewport pixels: { left, top, width, height }.
 */
export const screenRect = {
  monitor1: null,
  monitor2: null,
}
