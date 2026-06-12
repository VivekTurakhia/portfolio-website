import { useStore } from '../state/useStore'

/**
 * Top nav bar (~15% viewport height). Each tab triggers a room action.
 * To add a tab, push another entry into `tabs`.
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

  return (
    <nav className="navbar">
      <div className="navbar-brand">VIVEK</div>
      <ul className="navbar-tabs">
        {tabs.map((t) => (
          <li key={t.id}>
            <button
              className={'navbar-tab' + (currentView === t.view ? ' is-active' : '')}
              onClick={t.onClick}
            >
              {t.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
