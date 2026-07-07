import { Select } from '@react-three/postprocessing'
import { useStore } from '../state/useStore'
import { interactables } from './interactables'

/**
 * Generic wrapper that turns a group of meshes into a clickable object.
 *
 * The postprocessing outline is driven by the store's `hoveredId`, so an object
 * lights up whether you hover its mesh OR hover the matching nav tab / music
 * toggle. `group` lets several meshes (e.g. both speakers) share one hover key.
 *
 * Highlighting is room-only — once the camera has focused on something nothing
 * lights up — but clicks stay live everywhere (so the TV can advance clips).
 */
export function Interactive({ id, group, children, ...props }) {
  const def = interactables[id]
  // Boolean selector: this Interactive only re-renders when its own highlight
  // state flips, not on every hover change.
  const highlighted = useStore(
    (s) => s.currentView === 'room' && (s.hoveredId === id || (group != null && s.hoveredId === group))
  )

  const onOver = (e) => {
    if (useStore.getState().currentView !== 'room') return
    e.stopPropagation()
    useStore.getState().setHovered(group ?? id)
    document.body.style.cursor = 'pointer'
  }

  const onOut = (e) => {
    if (useStore.getState().currentView !== 'room') return
    e.stopPropagation()
    const hv = useStore.getState().hoveredId
    if (hv === id || hv === group) useStore.getState().setHovered(null)
    document.body.style.cursor = 'auto'
  }

  const onClick = (e) => {
    e.stopPropagation()
    def?.onSelect(useStore.getState())
  }

  return (
    <Select enabled={highlighted}>
      <group onPointerOver={onOver} onPointerOut={onOut} onClick={onClick} {...props}>
        {children}
      </group>
    </Select>
  )
}
