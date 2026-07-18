'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight } from 'lucide-react'
import { useLoaderStore } from '@/stores/loaderStore'

function GithubIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={`${className} fill-current`}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function XIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={`${className} fill-current`}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  )
}

const LINKS = [
  { label: 'GitHub', href: 'https://github.com/silasjul', Icon: GithubIcon, size: 'h-4.5 w-4.5' },
  { label: 'X', href: 'https://x.com/SilasCodes3D', Icon: XIcon, size: 'h-4 w-4' },
]

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60'

export default function SiteNav() {
  const root = useRef<HTMLElement>(null)
  const revealed = useLoaderStore((s) => s.revealed)

  const { contextSafe } = useGSAP(
    () => {
      if (reduced() || !root.current) return
      const q = gsap.utils.selector(root.current)
      const items = q('[data-item]')
      if (!revealed) {
        gsap.set(items, { autoAlpha: 0 })
        return
      }
      gsap
        .timeline({ delay: 0.1 })
        .to(items, { autoAlpha: 1, duration: 0.45, ease: 'power1.out' }, 0)
        .fromTo(items, { y: -26 }, { y: 0, duration: 0.9, ease: 'power4.out' }, 0)
        .fromTo(items, { color: '#666' }, { color: '#eef0f5', duration: 1, ease: 'power2.out' }, 0.15)
        .fromTo(
          q('[data-pill]'),
          { backgroundColor: '#666' },
          { backgroundColor: '#05060a', duration: 1, ease: 'power2.out' },
          0.15,
        )
    },
    { scope: root, dependencies: [revealed] },
  )

  const arrowEnter = contextSafe((e: React.SyntheticEvent<HTMLAnchorElement>) => {
    if (reduced()) return
    gsap.to(e.currentTarget.querySelector('[data-arrow]'), {
      x: 3,
      y: -2,
      duration: 0.3,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  })

  const arrowLeave = contextSafe((e: React.SyntheticEvent<HTMLAnchorElement>) => {
    if (reduced()) return
    gsap.to(e.currentTarget.querySelector('[data-arrow]'), {
      x: 0,
      y: 0,
      duration: 0.35,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  })

  return (
    <nav
      ref={root}
      aria-label="Primary"
      className="fixed inset-x-0 top-0 z-20 flex justify-center items-center gap-1 pt-4 sm:pt-5.5 uppercase pointer-events-none font-(family-name:--font-roboto-mono)"
    >
      {LINKS.map(({ label, href, Icon, size }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          data-item
          className={`pointer-events-auto inline-flex h-10 w-10 items-center justify-center text-[#eef0f5] drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] ${focusRing}`}
        >
          <Icon className={size} />
        </a>
      ))}

      <a
        href="mailto:kiersteinsilas@gmail.com"
        data-item
        data-pill
        onMouseEnter={arrowEnter}
        onMouseLeave={arrowLeave}
        onFocus={arrowEnter}
        onBlur={arrowLeave}
        className={`pointer-events-auto relative ml-2 inline-flex h-10 items-center rounded-md bg-[#05060a] px-5.5 text-xs tracking-[0.14em] text-[#eef0f5] no-underline shadow-[0_12px_32px_-14px_rgba(0,0,0,0.8),0_2px_10px_-2px_rgba(0,0,0,0.35)] ${focusRing}`}
      >
        <span className="inline-flex items-center gap-2 leading-none">
          Contact
          <span data-arrow className="inline-flex">
            <ArrowUpRight aria-hidden className="h-4 w-4" />
          </span>
        </span>
      </a>
    </nav>
  )
}
