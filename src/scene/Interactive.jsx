import { useState } from 'react'
import { Select } from '@react-three/postprocessing'
import { useStore } from '../state/useStore'
import { interactables } from './interactables'

/**
 * Generic wrapper that turns any group of meshes into a clickable object.
 *
 * - Hover: highlights via the postprocessing <Select> (read by the top-level
 *   <Outline> effect) and sets the pointer cursor.
 * - Click: dispatches to interactables[id].onSelect(store).
 *
 * One wrapper per interactive object in Room.jsx; behavior lives in the registry.
 */
export function Interactive({ id, children, ...props }) {
  const [hovered, setHovered] = useState(false)
  const def = interactables[id]

  const onOver = (e) => {
    e.stopPropagation()
    setHovered(true)
    useStore.getState().setHovered(id)
    document.body.style.cursor = 'pointer'
  }

  const onOut = (e) => {
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
    <Select enabled={hovered}>
      <group onPointerOver={onOver} onPointerOut={onOut} onClick={onClick} {...props}>
        {children}
      </group>
    </Select>
  )
}
