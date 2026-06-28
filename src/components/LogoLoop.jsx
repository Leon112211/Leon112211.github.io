import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './LogoLoop.css'

const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 }

const toCssLength = (value) => (typeof value === 'number' ? `${value}px` : (value ?? undefined))

function useResizeObserver(callback, elements, dependencies) {
  useEffect(() => {
    if (!window.ResizeObserver) {
      window.addEventListener('resize', callback)
      callback()
      return () => window.removeEventListener('resize', callback)
    }

    const observers = elements.map((ref) => {
      if (!ref.current) return null
      const observer = new ResizeObserver(callback)
      observer.observe(ref.current)
      return observer
    })

    callback()
    return () => observers.forEach((observer) => observer?.disconnect())
  }, [callback, elements, dependencies])
}

function useAnimationLoop(trackRef, targetVelocity, seqWidth, isHovered, hoverSpeed) {
  const rafRef = useRef(null)
  const lastTimestampRef = useRef(null)
  const offsetRef = useRef(0)
  const velocityRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined

    if (seqWidth > 0) {
      offsetRef.current = ((offsetRef.current % seqWidth) + seqWidth) % seqWidth
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`
    }

    const animate = (timestamp) => {
      if (lastTimestampRef.current === null) lastTimestampRef.current = timestamp
      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000
      lastTimestampRef.current = timestamp
      const target = isHovered ? hoverSpeed : targetVelocity
      const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU)
      velocityRef.current += (target - velocityRef.current) * easingFactor

      if (seqWidth > 0) {
        offsetRef.current = ((offsetRef.current + velocityRef.current * deltaTime) % seqWidth + seqWidth) % seqWidth
        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      lastTimestampRef.current = null
    }
  }, [hoverSpeed, isHovered, seqWidth, targetVelocity, trackRef])
}

const LogoLoop = memo(({
  logos,
  speed = 72,
  direction = 'left',
  logoHeight = 24,
  gap = 48,
  hoverSpeed = 0,
  fadeOut = true,
  fadeOutColor,
  scaleOnHover = true,
  ariaLabel = 'Personal account links',
  className = '',
}) => {
  const containerRef = useRef(null)
  const trackRef = useRef(null)
  const seqRef = useRef(null)
  const [seqWidth, setSeqWidth] = useState(0)
  const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES)
  const [isHovered, setIsHovered] = useState(false)

  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0
    const sequenceWidth = seqRef.current?.getBoundingClientRect?.().width ?? 0
    if (sequenceWidth > 0) {
      setSeqWidth(Math.ceil(sequenceWidth))
      setCopyCount(Math.max(
        ANIMATION_CONFIG.MIN_COPIES,
        Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM,
      ))
    }
  }, [])

  useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight])

  const velocity = Math.abs(speed) * (direction === 'right' ? -1 : 1) * (speed < 0 ? -1 : 1)
  useAnimationLoop(trackRef, velocity, seqWidth, isHovered, hoverSpeed)

  const style = useMemo(() => ({
    '--logoloop-gap': `${gap}px`,
    '--logoloop-logoHeight': toCssLength(logoHeight),
    ...(fadeOutColor ? { '--logoloop-fadeColor': fadeOutColor } : {}),
  }), [fadeOutColor, gap, logoHeight])

  const renderItem = useCallback((item, key, duplicate) => {
    const isExternal = /^https?:/i.test(item.href)
    return (
      <li className="logoloop__item" key={key} role="listitem">
        <a
          className="logoloop__link"
          href={item.href}
          aria-label={duplicate ? undefined : item.title}
          tabIndex={duplicate ? -1 : 0}
          {...(isExternal ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
        >
          <span className="logoloop__node" aria-hidden="true">{item.node}</span>
        </a>
      </li>
    )
  }, [])

  const lists = useMemo(() => Array.from({ length: copyCount }, (_, copyIndex) => (
    <ul
      className="logoloop__list"
      key={`copy-${copyIndex}`}
      role="list"
      aria-hidden={copyIndex > 0}
      ref={copyIndex === 0 ? seqRef : undefined}
    >
      {logos.map((item, itemIndex) => renderItem(item, `${copyIndex}-${itemIndex}`, copyIndex > 0))}
    </ul>
  )), [copyCount, logos, renderItem])

  const rootClassName = [
    'logoloop',
    fadeOut && 'logoloop--fade',
    scaleOnHover && 'logoloop--scale-hover',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div ref={containerRef} className={rootClassName} style={style} role="region" aria-label={ariaLabel}>
      <div
        className="logoloop__track"
        ref={trackRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {lists}
      </div>
    </div>
  )
})

LogoLoop.displayName = 'LogoLoop'

export default LogoLoop
