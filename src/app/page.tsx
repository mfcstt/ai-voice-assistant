'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Orb } from '@/components/ui/orb'
import { AVAILABLE_VOICES, ORB_COLORS_BY_VOICE } from '@/app/chat/constants'

const TRANSITION_MS = 4200

const hexToRgb = (hex: string) => {
  const normalized = hex.replace('#', '')
  const value = Number.parseInt(normalized, 16)

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  }
}

const rgbToHex = (r: number, g: number, b: number) => {
  const toHex = (value: number) => Math.round(value).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

const interpolateHex = (from: string, to: string, t: number) => {
  const start = hexToRgb(from)
  const end = hexToRgb(to)

  return rgbToHex(
    start.r + (end.r - start.r) * t,
    start.g + (end.g - start.g) * t,
    start.b + (end.b - start.b) * t
  )
}

export default function HomePage() {
  const voiceIds = useMemo(() => AVAILABLE_VOICES.map(voice => voice.id), [])
  const colorsRef = useRef<[string, string]>(ORB_COLORS_BY_VOICE[voiceIds[0]])

  useEffect(() => {
    let frameId = 0

    const animate = (time: number) => {
      const total = voiceIds.length
      const segment = Math.floor(time / TRANSITION_MS) % total
      const nextSegment = (segment + 1) % total
      const segmentStart = Math.floor(time / TRANSITION_MS) * TRANSITION_MS
      const t = Math.min(1, (time - segmentStart) / TRANSITION_MS)

      const fromVoiceId = voiceIds[segment]
      const toVoiceId = voiceIds[nextSegment]
      const fromColors = ORB_COLORS_BY_VOICE[fromVoiceId]
      const toColors = ORB_COLORS_BY_VOICE[toVoiceId]

      colorsRef.current = [
        interpolateHex(fromColors[0], toColors[0], t),
        interpolateHex(fromColors[1], toColors[1], t),
      ]

      frameId = window.requestAnimationFrame(animate)
    }

    frameId = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [voiceIds])

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-6 text-foreground sm:py-8">
      <div className="flex w-full max-w-4xl flex-col items-center gap-6 sm:gap-8">

        <div className="aspect-square w-full max-w-80 sm:max-w-110">
          <Orb className="size-full" colorsRef={colorsRef} seed={11} />
        </div>

        <Button asChild size="lg" className="w-full max-w-xs rounded-full px-6 sm:w-auto sm:px-8">
          <Link href="/chat">Abrir assistente de voz</Link>
        </Button>
      </div>
    </main>
  )
}
