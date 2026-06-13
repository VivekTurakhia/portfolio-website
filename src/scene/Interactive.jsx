import { useEffect, useState } from 'react'
import { Select } from '@react-three/postprocessing'
import { useStore } from '../state/useStore'
import { interactables } from './interactables'

/**
 * Generic wrapper that turns any group of meshes into a clickable object.
 *
 * Hover highlighting (the postprocessing outline) and the pointer cursor are
 * only active in the room view. Once the camera has focused on something, no
 * object should light up or look "selectable" — but clicks stay live so the TV
 * can still be clicked to advance to the next clip while you're watching it.
 */
export function Interactive({ id, children, ...props }) {
  const [hovered, setHovered] = useState(false)
  const inRoom = useStore((s) => s.currentView === 'room')
  const def = interactables[id]

  // Leaving the room cancels any in-progress hover (the pointerOut event may
  // never fire once the camera flies away).
  useEffect(() => {
    if (!inRoom) {
      setHovered(false)
      document.body.style.cursor = 'auto'
    }
  }, [inRoom])

  const onOver = (e) => {
    if (!inRoom) return
    e.stopPropagation()
    setHovered(true)
    useStore.getState().setHovered(id)
    document.body.style.cursor = 'pointer'
  }

  const onOut = (e) => {
    if (!inRoom) return
    e.stopPropagation()
    setHovered(false)
    if (useStore.getState().hoveredId === id) useStore.getState().setHovered(null)
    document.body.style.cursor = 'auto'
  }

  const onClick = (e) => {
    e.stopPropagation()
    def?.onSelect(useStore.getState())
  }

  return (
    <Select enabled={inRoom && hovered}>
      <group onPointerOver={onOver} onPointerOut={onOut} onClick={onClick} {...props}>
        {children}
      </group>
    </Select>
  )
}
