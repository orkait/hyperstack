'use client'
import { useLenis } from 'lenis/react'
import { useRef } from 'react'

export function ParallaxLayer({
  speed = 0.5,
  children,
}: {
  speed?: number
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useLenis(({ scroll }) => {
    if (ref.current) {
      ref.current.style.transform = `translateY(${scroll * speed}px)`
    }
  })

  return <div ref={ref} style={{ willChange: 'transform' }}>{children}</div>
}
