'use client'
import { useLenis } from 'lenis/react'
import { useEffect } from 'react'

export function Modal({ isOpen, onClose, children }: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  const lenis = useLenis()

  useEffect(() => {
    if (isOpen) lenis?.stop()
    else lenis?.start()
    return () => lenis?.start() // safety cleanup
  }, [isOpen, lenis])

  if (!isOpen) return null
  return (
    <div role="dialog" aria-modal="true">
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  )
}
