import { useStore } from '../state/useStore'

/** Returns to the room. For monitors this first plays the power-off animation
 *  (via leaveView), then the camera flies back. Hidden while already in the room. */
export function BackButton() {
  const currentView = useStore((s) => s.currentView)
  const leaveView = useStore((s) => s.leaveView)

  if (currentView === 'room') return null

  return (
    <button className="back-btn" onClick={leaveView}>
      ← Back to room
    </button>
  )
}
