'use client'
import { useLenis } from 'lenis/react'
import { useState } from 'react'

export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const lenis = useLenis(({ scroll }) => setVisible(scroll > 400))

  return visible ? (
    <button onClick={() => lenis?.scrollTo(0, { duration: 1.2 })}>
      ↑ Top
    </button>
  ) : null
}
