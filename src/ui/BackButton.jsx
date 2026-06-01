import { useStore } from '../state/useStore'

/** Returns the camera to the default room view. Hidden while already in the room. */
export function BackButton() {
  const currentView = useStore((s) => s.currentView)
  const setView = useStore((s) => s.setView)

  if (currentView === 'room') return null

  return (
    <button className="back-btn" onClick={() => setView('room')}>
      ← Back to room
    </button>
  )
}
