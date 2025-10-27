'use client'

import * as React from 'react'

export interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Enable 3D tilt effect on hover */
  tilt?: boolean
  /** Enable border glow that follows cursor */
  glowEffect?: boolean
  /** Tilt intensity (0-1, default 0.1) */
  tiltIntensity?: number
  /** Card variant */
  variant?: 'standard' | 'glass'
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  (
    {
      children,
      className,
      tilt = true,
      glowEffect = true,
      tiltIntensity = 0.1,
      variant = 'standard',
      onMouseMove,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const cardRef = React.useRef<HTMLDivElement | null>(null)
    const [glowPosition, setGlowPosition] = React.useState({ x: 0, y: 0 })

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return

      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (glowEffect) {
        setGlowPosition({ x, y })
      }

      if (tilt) {
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const rotateX = ((y - centerY) / centerY) * -10 * tiltIntensity
        const rotateY = ((x - centerX) / centerX) * 10 * tiltIntensity

        cardRef.current.style.transform = `
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          scale3d(1.02, 1.02, 1.02)
        `
      }

      if (onMouseMove) onMouseMove(e)
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return

      if (tilt) {
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
      }

      if (onMouseLeave) onMouseLeave(e)
    }

    return (
      <div
        ref={(node) => {
          cardRef.current = node
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        className={`
          ${variant === 'standard' ? 'card-mm' : 'glass-card'}
          relative
          transition-all duration-300 ease-out
          ${tilt ? 'transform-gpu' : ''}
          ${className || ''}
        `}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: 'preserve-3d',
        }}
        {...props}
      >
        {/* Glow effect */}
        {glowEffect && (
          <div
            className="pointer-events-none absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(600px circle at ${glowPosition.x}px ${glowPosition.y}px, rgba(51, 125, 239, 0.15), transparent 40%)`,
              borderRadius: 'inherit',
              overflow: 'hidden',
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
          {children}
        </div>
      </div>
    )
  }
)
EnhancedCard.displayName = 'EnhancedCard'

export { EnhancedCard }
