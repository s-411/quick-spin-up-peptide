'use client'

import * as React from 'react'

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Animation type */
  animation?: 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale'
  /** Delay before animation starts (ms) */
  delay?: number
  /** Duration of animation (ms) */
  duration?: number
  /** Trigger once or every time element enters viewport */
  once?: boolean
  /** Threshold for intersection observer (0-1) */
  threshold?: number
}

const ScrollReveal = React.forwardRef<HTMLDivElement, ScrollRevealProps>(
  (
    {
      children,
      className,
      animation = 'fade',
      delay = 0,
      duration = 600,
      once = true,
      threshold = 0.1,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(false)
    const elementRef = React.useRef<HTMLDivElement | null>(null)

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            if (once && elementRef.current) {
              observer.unobserve(elementRef.current)
            }
          } else if (!once) {
            setIsVisible(false)
          }
        },
        { threshold }
      )

      if (elementRef.current) {
        observer.observe(elementRef.current)
      }

      return () => {
        if (elementRef.current) {
          observer.unobserve(elementRef.current)
        }
      }
    }, [once, threshold])

    const getAnimationStyles = () => {
      const baseStyles = {
        transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        transitionDelay: `${delay}ms`,
      }

      if (!isVisible) {
        switch (animation) {
          case 'fade':
            return { ...baseStyles, opacity: 0 }
          case 'slide-up':
            return { ...baseStyles, opacity: 0, transform: 'translateY(30px)' }
          case 'slide-left':
            return { ...baseStyles, opacity: 0, transform: 'translateX(-30px)' }
          case 'slide-right':
            return { ...baseStyles, opacity: 0, transform: 'translateX(30px)' }
          case 'scale':
            return { ...baseStyles, opacity: 0, transform: 'scale(0.9)' }
          default:
            return baseStyles
        }
      }

      return { ...baseStyles, opacity: 1, transform: 'translateY(0) translateX(0) scale(1)' }
    }

    return (
      <div
        ref={(node) => {
          elementRef.current = node
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        className={className}
        style={getAnimationStyles()}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ScrollReveal.displayName = 'ScrollReveal'

export { ScrollReveal }
