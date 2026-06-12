import { Suspense, lazy, useEffect, useRef, useState } from 'react'
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
  const focused = VIEWS[view] ? view : null

  // `shown` is the view whose page is mounted — it lingers (with `closing` true)
  // after focus leaves so the power-off animation can play before unmounting.
  const [shown, setShown] = useState(null)
  const [closing, setClosing] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    clearTimeout(timer.current)
    if (focused) {
      setShown(focused)
      setClosing(false)
    } else if (shown) {
      setClosing(true)
      timer.current = setTimeout(() => {
        setShown(null)
        setClosing(false)
      }, OFF_MS)
    }
    return () => clearTimeout(timer.current)
  }, [focused]) // eslint-disable-line react-hooks/exhaustive-deps

  const rect = useProjectedRect(shown)
  const cfg = shown ? VIEWS[shown] : null
  if (!cfg || !rect) return null

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
