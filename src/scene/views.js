/**
 * Named camera presets. The CameraRig springs `position` and `target`
 * (lookAt point) toward whichever view is active in the store.
 *
 * Values are in world units. Tune these live with a screenshot loop — the
 * monitor1 view in particular needs to frame the screen straight-on so the
 * <Html> page mounted on it reads cleanly.
 */
export const views = {
  // Default overview of the room + avatar at the desk.
  room: {
    position: [1.8, 1.4, 2.4],
    target: [-0.3, 0.5, -0.5],
  },

  // Close-up, straight-on framing of monitor1's screen.
  // monitor1 node sits at [-0.321, 0.511, -0.857], screen faces +Z.
  monitor1: {
    position: [-0.32, 0.642, -0.39],
    target: [-0.32, 0.642, -0.857],
  },

  // monitor2's screen-face center is [0.042, 0.630, -0.812] (from the GLB) and
  // its normal is [sin(-0.182), 0, cos(-0.182)] ≈ [-0.181, 0, 0.983]. Camera
  // sits out along that normal looking back, so the square screen reads
  // straight-on.
  monitor2: {
    position: [-0.076, 0.487, -0.173],
    target: [0.042, 0.487, -0.812],
  },

  // tv at [0.631, 0.97, -0.67], rotated -0.105 rad about Y; normal ≈ [0.105, 0, 0.994].
  // Pulled back further than the monitors — it's a bigger screen.
  tv: {
    position: [0.734, 0.97, 0.31],
    target: [0.631, 0.97, -0.67],
  },
}

export const DEFAULT_VIEW = 'room'
