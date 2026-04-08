'use client'
import { useState } from 'react'
import { useLenis } from 'lenis/react'

// Scroll event properties:
// scroll    — current position (px)
// limit     — max scroll (px)
// velocity  — scroll speed
// direction — 1 (down) or -1 (up)
// progress  — 0 to 1

export function DirectionIndicator() {
  const [dir, setDir] = useState<'up' | 'down'>('down')

  useLenis(({ direction }) => {
    if (direction === 1) setDir('down')
    if (direction === -1) setDir('up')
  })

  return <div>Scrolling: {dir}</div>
}
