import { useStore } from '../state/useStore'
import { MusicToggle } from './MusicToggle.jsx'

/**
 * Top nav bar. Each tab triggers a room action, and hovering a tab highlights
 * the object it targets (same outline as hovering the object itself).
 */
export function NavBar() {
  const currentView = useStore((s) => s.currentView)
  const setView = useStore((s) => s.setView)

  const tabs = [
    { id: 'about', label: 'About Me', view: 'monitor1', onClick: () => setView('monitor1') },
    { id: 'status', label: 'Status', view: 'monitor2', onClick: () => setView('monitor2') },
    {
      id: 'films',
      label: 'Films',
      view: 'tv',
      onClick: () => {
        useStore.getState().tvActivate()
        setView('tv')
      },
    },
  ]

  const onEnter = (target) => () => useStore.getState().setHovered(target)
  const onLeave = (target) => () => {
    if (useStore.getState().hoveredId === target) useStore.getState().setHovered(null)
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">VIVEK</div>
      <div className="navbar-right">
        <ul className="navbar-tabs">
          {tabs.map((t) => (
            <li key={t.id}>
              <button
                className={'navbar-tab' + (currentView === t.view ? ' is-active' : '')}
                onClick={t.onClick}
                onMouseEnter={onEnter(t.view)}
                onMouseLeave={onLeave(t.view)}
              >
                {t.label}
              </button>
            </li>
          ))}
        </ul>
        <MusicToggle />
      </div>
    </nav>
  )
}
