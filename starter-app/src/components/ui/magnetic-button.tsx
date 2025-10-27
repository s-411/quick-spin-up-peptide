'use client'

import * as React from 'react'

export interface MagneticButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button text or content */
  children: React.ReactNode
  /** Strength of magnetic effect (0-1, default 0.5) */
  magneticStrength?: number
  /** Enable ripple effect on click */
  ripple?: boolean
  /** Button variant */
  variant?: 'primary' | 'secondary'
}

const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  (
    {
      children,
      className,
      magneticStrength = 0.5,
      ripple = true,
      variant = 'primary',
      onMouseMove,
      onMouseLeave,
      onClick,
      ...props
    },
    ref
  ) => {
    const buttonRef = React.useRef<HTMLButtonElement | null>(null)
    const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([])

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return

      const rect = buttonRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = (e.clientX - centerX) * magneticStrength * 0.3
      const deltaY = (e.clientY - centerY) * magneticStrength * 0.3

      buttonRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.03)`

      if (onMouseMove) onMouseMove(e)
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return
      buttonRef.current.style.transform = 'translate(0px, 0px) scale(1)'

      if (onMouseLeave) onMouseLeave(e)
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const id = Date.now()

        setRipples((prev) => [...prev, { x, y, id }])

        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id))
        }, 600)
      }

      if (onClick) onClick(e)
    }

    return (
      <button
        ref={(node) => {
          buttonRef.current = node
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        className={`
          ${variant === 'primary' ? 'btn-mm' : 'btn-secondary'}
          relative overflow-hidden
          transition-all duration-200 ease-out
          ${className || ''}
        `}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        {...props}
      >
        {children}

        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none animate-ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 0,
              height: 0,
              animation: 'ripple 0.6s ease-out',
            }}
          />
        ))}
      </button>
    )
  }
)
MagneticButton.displayName = 'MagneticButton'

export { MagneticButton }
