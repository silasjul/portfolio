'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useProgress } from '@react-three/drei'
import { useLoaderStore } from '@/stores/loaderStore'

const MIN_SHOW_MS = 600
const FORCE_DONE_MS = 5000

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function ScreenLoader() {
  const overlay = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  const shown = useRef({ v: 0 })
  const reveal = useLoaderStore((s) => s.reveal)
  const { progress, active } = useProgress()
  const [forced, setForced] = useState(false)
  const [gone, setGone] = useState(false)
  const mountedAt = useRef(0)

  useEffect(() => {
    mountedAt.current = performance.now()
    const t = setTimeout(() => setForced(true), FORCE_DONE_MS)
    return () => clearTimeout(t)
  }, [])

  const done = forced || (progress >= 100 && !active)

  const writeCount = () => {
    if (counter.current) counter.current.textContent = `${Math.round(shown.current.v)}%`
  }

  useGSAP(
    () => {
      if (done) return
      gsap.to(shown.current, {
        v: progress,
        duration: 0.6,
        ease: 'power1.out',
        overwrite: 'auto',
        onUpdate: writeCount,
      })
    },
    { dependencies: [progress, done] },
  )

  useGSAP(
    () => {
      if (!done || !overlay.current) return
      if (reduced()) {
        shown.current.v = 100
        writeCount()
        reveal()
        setGone(true)
        return
      }
      const wait = Math.max(0, MIN_SHOW_MS - (performance.now() - mountedAt.current)) / 1000
      gsap
        .timeline({ delay: wait, onComplete: () => setGone(true) })
        .to(shown.current, {
          v: 100,
          duration: 0.5,
          ease: 'power1.inOut',
          overwrite: 'auto',
          onUpdate: writeCount,
        })
        .to(overlay.current, {
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onStart: reveal,
        })
    },
    { dependencies: [done] },
  )

  if (gone) return null

  return (
    <div
      ref={overlay}
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-60 bg-black"
    >
      <span
        ref={counter}
        className="absolute bottom-2 left-4 sm:bottom-4 sm:left-8 font-(family-name:--font-roboto-mono) text-[clamp(5rem,17vw,16rem)] leading-none tracking-tighter text-[#eef0f5]"
      >
        0%
      </span>
    </div>
  )
}
