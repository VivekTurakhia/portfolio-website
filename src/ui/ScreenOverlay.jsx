import { Suspense, lazy, useEffect, useState } from 'react'
import { useStore } from '../state/useStore'
import { screenRect } from '../scene/screenRect'

const IdeScreen = lazy(() => import('./ide/IdeScreen'))
const StatusScreen = lazy(() => import('./status/StatusScreen'))

/**
 * The interactive layer for the monitor "webpages".
 *
 * The pages are NOT rendered in-world (that was slow and the CSS-3D panel blocked
 * clicks on the monitor). They only exist here, while a monitor is focused, as a
 * flat (reliably clickable) DOM panel positioned over the monitor via the
 * per-frame camera projection of the real screen mesh (ScreenProjector /
 * screenRect).
 *
 * Focusing a screen plays a CRT power-on (opens from a center line, up + down);
 * leaving it plays the same animation in reverse before the page unmounts.
 */

const VIEWS = {
  monitor1: { w: 580, h: 327, cls: 'monitor-screen', Comp: IdeScreen },
  monitor2: { w: 380, h: 380, cls: 'status-screen', Comp: StatusScreen },
}

const OFF_MS = 320 // must match the crt-off animation duration in styles.css

// Read the projected screen rect from `screenRect` via rAF so the overlay tracks
// the monitor even while the camera spring is still moving.
function useProjectedRect(view) {
  const [rect, setRect] = useState(null)
  useEffect(() => {
    setRect(null)
    if (!view) return
    let raf
    const tick = () => {
      const r = screenRect[view]
      if (r && r.width > 1) setRect(r)
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [view])
  return rect
}

export function ScreenOverlay() {
  const view = useStore((s) => s.currentView)
  const cameraSettled = useStore((s) => s.cameraSettled)
  const exiting = useStore((s) => s.exiting)

  const cfg = VIEWS[view]
  // Power on only after the camera has arrived (cameraSettled). While `exiting`,
  // the page stays mounted and plays its power-off before the camera leaves.
  const show = !!cfg && (cameraSettled || exiting)
  const closing = exiting

  // Once the power-off has had time to finish, tell the store to move the camera.
  useEffect(() => {
    if (!exiting) return
    const t = setTimeout(() => useStore.getState().finishExit(), OFF_MS)
    return () => clearTimeout(t)
  }, [exiting])

  const rect = useProjectedRect(show ? view : null)
  if (!show || !rect) return null

  const { w, h, cls, Comp } = cfg
  const scale = rect.width / w

  return (
    <div
      className="screen-overlay"
      style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
    >
      <div className="screen-overlay-inner" style={{ width: w, height: h, transform: `scale(${scale})` }}>
        <div className={'crt ' + (closing ? 'crt-off' : 'crt-on')}>
          <div className={cls}>
            <Suspense fallback={null}>
              <Comp />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
