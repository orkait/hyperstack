'use client'
import { useLenis } from 'lenis/react'
import { useState } from 'react'

export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)

  useLenis(({ progress }) => setProgress(progress))

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        width: `${progress * 100}%`,
        background: 'currentColor',
        zIndex: 9999,
        transition: 'width 0.05s linear',
      }}
    />
  )
}
