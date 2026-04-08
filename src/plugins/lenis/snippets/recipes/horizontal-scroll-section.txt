'use client'
import { ReactLenis } from 'lenis/react'
import { useRef } from 'react'

export function HorizontalScroller({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <ReactLenis
      options={{
        wrapper: wrapperRef,
        content: contentRef,
        orientation: 'horizontal',
        gestureOrientation: 'both',
        lerp: 0.05,
      }}
    >
      <div
        ref={wrapperRef}
        style={{ overflow: 'hidden', width: '100vw', height: '100vh' }}
      >
        <div ref={contentRef} style={{ display: 'flex', width: 'max-content' }}>
          {children}
        </div>
      </div>
    </ReactLenis>
  )
}
