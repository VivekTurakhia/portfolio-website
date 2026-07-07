import { useStore } from '../state/useStore'

/**
 * Speaker music toggle, shown in the nav bar. Hovering it highlights the 3D
 * speakers (both share the 'speakers' hover group), mirroring the object hover.
 */
export function MusicToggle() {
  const musicOn = useStore((s) => s.musicOn)
  const toggleMusic = useStore((s) => s.toggleMusic)

  const onEnter = () => useStore.getState().setHovered('speakers')
  const onLeave = () => {
    if (useStore.getState().hoveredId === 'speakers') useStore.getState().setHovered(null)
  }

  return (
    <button
      className={'music-toggle' + (musicOn ? ' is-on' : '')}
      onClick={toggleMusic}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-label={musicOn ? 'Pause music' : 'Play music'}
      aria-pressed={musicOn}
      title={musicOn ? 'Pause music' : 'Play music'}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        {/* speaker body */}
        <path d="M4 9v6h3.5L12 19V5L7.5 9H4z" fill="currentColor" />
        {musicOn ? (
          // sound waves
          <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M17.8 6.2a8.5 8.5 0 0 1 0 11.6" />
          </g>
        ) : (
          // mute X
          <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M16 9.5l4 5M20 9.5l-4 5" />
          </g>
        )}
      </svg>
    </button>
  )
}
