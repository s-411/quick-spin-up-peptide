'use client'

import * as React from 'react'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { Play, Volume2, VolumeX } from 'lucide-react'

export interface HeroVideoProps {
  /** Main headline */
  headline?: string
  /** Subheadline or description */
  subheadline?: string
  /** Primary CTA button text */
  primaryCTA?: string
  /** Primary button click handler */
  onPrimaryClick?: () => void
  /** Video URL (mp4, webm, etc.) */
  videoUrl?: string
  /** Video poster image */
  posterUrl?: string
  /** Overlay opacity (0-1) */
  overlayOpacity?: number
}

export function HeroVideo({
  headline = 'Experience the Future',
  subheadline = 'Build beautiful, performant applications with our modern design system',
  primaryCTA = 'Get Started Free',
  onPrimaryClick,
  videoUrl,
  posterUrl,
  overlayOpacity = 0.6,
}: HeroVideoProps) {
  const [isMuted, setIsMuted] = React.useState(true)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      {videoUrl ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster={posterUrl}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        // Fallback gradient background
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-secondary" />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-background"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 space-y-8">
        <h1 className="text-5xl md:text-7xl font-heading leading-tight text-foreground drop-shadow-lg">
          {headline}
        </h1>

        <p className="text-lg md:text-2xl text-foreground/90 max-w-2xl mx-auto drop-shadow">
          {subheadline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <MagneticButton
            variant="primary"
            onClick={onPrimaryClick}
          >
            <Play className="w-4 h-4" />
            {primaryCTA}
          </MagneticButton>

          {videoUrl && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-foreground/50 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  )
}
