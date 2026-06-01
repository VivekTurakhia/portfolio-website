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
    position: [-0.32, 0.52, 0.02],
    target: [-0.32, 0.52, -0.857],
  },
}

export const DEFAULT_VIEW = 'room'
