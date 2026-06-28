import { useCallback, useEffect, useRef } from 'react'
import './BorderGlow.css'

function parseHSL(hslStr) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/)
  if (!match) return { h: 40, s: 80, l: 80 }
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) }
}

function buildGlowVars(glowColor, intensity) {
  const { h, s, l } = parseHSL(glowColor)
  const base = `${h}deg ${s}% ${l}%`
  const opacities = [100, 60, 50, 40, 30, 20, 10]
  const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10']
  const vars = {}

  for (let i = 0; i < opacities.length; i += 1) {
    vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`
  }

  return vars
}

const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%']
const GRADIENT_KEYS = ['--gradient-one', '--gradient-two', '--gradient-three', '--gradient-four', '--gradient-five', '--gradient-six', '--gradient-seven']
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1]

function buildGradientVars(colors) {
  const vars = {}

  for (let i = 0; i < 7; i += 1) {
    const color = colors[Math.min(COLOR_MAP[i], colors.length - 1)]
    vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${color} 0px, transparent 50%)`
  }

  vars['--gradient-base'] = `linear-gradient(${colors[0]} 0 100%)`
  return vars
}

function easeOutCubic(x) {
  return 1 - (1 - x) ** 3
}

function easeInCubic(x) {
  return x * x * x
}

function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }) {
  const startTime = performance.now() + delay
  let timeoutId
  let animationFrameId
  let cancelled = false

  function tick() {
    if (cancelled) return

    const elapsed = performance.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    onUpdate(start + (end - start) * ease(progress))

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(tick)
    } else if (onEnd) {
      onEnd()
    }
  }

  timeoutId = window.setTimeout(() => {
    if (cancelled) return
    animationFrameId = requestAnimationFrame(tick)
  }, delay)

  return () => {
    cancelled = true
    window.clearTimeout(timeoutId)
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
  }
}

export default function BorderGlow({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  backgroundColor = '#120F17',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1,
  coneSpread = 25,
  animated = false,
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  fillOpacity = 0.5,
}) {
  const cardRef = useRef(null)
  const introAnimationCleanupsRef = useRef([])
  // Tracks whether the glow is currently shown for THIS card, so reset/global
  // handlers can no-op for the (usually 8 of 9) cards the pointer isn't over —
  // avoiding per-pointermove layout reads + style writes (thrash). Behavior is
  // identical to writing unconditionally.
  const glowActiveRef = useRef(false)

  const stopIntroAnimation = useCallback(() => {
    introAnimationCleanupsRef.current.forEach((cleanup) => cleanup())
    introAnimationCleanupsRef.current = []
  }, [])

  const getCenterOfElement = useCallback((element) => {
    const { width, height } = element.getBoundingClientRect()
    return [width / 2, height / 2]
  }, [])

  const getEdgeProximity = useCallback((element, x, y) => {
    const [centerX, centerY] = getCenterOfElement(element)
    const dx = x - centerX
    const dy = y - centerY
    let kx = Infinity
    let ky = Infinity

    if (dx !== 0) kx = centerX / Math.abs(dx)
    if (dy !== 0) ky = centerY / Math.abs(dy)

    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1)
  }, [getCenterOfElement])

  const getCursorAngle = useCallback((element, x, y) => {
    const [centerX, centerY] = getCenterOfElement(element)
    const dx = x - centerX
    const dy = y - centerY

    if (dx === 0 && dy === 0) return 0

    const radians = Math.atan2(dy, dx)
    let degrees = radians * (180 / Math.PI) + 90
    if (degrees < 0) degrees += 360

    return degrees
  }, [getCenterOfElement])

  const handlePointerMove = useCallback((event) => {
    const card = cardRef.current
    if (!card) return

    if (introAnimationCleanupsRef.current.length) {
      stopIntroAnimation()
      card.classList.remove('sweep-active')
    }

    const rect = card.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const edge = getEdgeProximity(card, x, y)
    const angle = getCursorAngle(card, x, y)

    card.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(3)}`)
    card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`)
    glowActiveRef.current = true
  }, [getCursorAngle, getEdgeProximity, stopIntroAnimation])

  const resetGlow = useCallback(() => {
    const card = cardRef.current
    if (!card || !glowActiveRef.current) return

    stopIntroAnimation()
    card.style.setProperty('--edge-proximity', '0')
    card.style.setProperty('--cursor-angle', '45deg')
    card.classList.remove('sweep-active')
    glowActiveRef.current = false
  }, [stopIntroAnimation])

  useEffect(() => {
    if (!animated || !cardRef.current) return undefined

    const card = cardRef.current
    const angleStart = 110
    const angleEnd = 465

    card.classList.add('sweep-active')
    card.style.setProperty('--cursor-angle', `${angleStart}deg`)
    glowActiveRef.current = true

    introAnimationCleanupsRef.current = [
      animateValue({ duration: 500, onUpdate: (value) => card.style.setProperty('--edge-proximity', value) }),
      animateValue({
        ease: easeInCubic,
        duration: 1500,
        end: 50,
        onUpdate: (value) => card.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (value / 100) + angleStart}deg`),
      }),
      animateValue({
        ease: easeOutCubic,
        delay: 1500,
        duration: 2250,
        start: 50,
        end: 100,
        onUpdate: (value) => card.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (value / 100) + angleStart}deg`),
      }),
      animateValue({
        ease: easeInCubic,
        delay: 2500,
        duration: 1500,
        start: 100,
        end: 0,
        onUpdate: (value) => card.style.setProperty('--edge-proximity', value),
        onEnd: resetGlow,
      }),
    ]

    return resetGlow
  }, [animated, resetGlow])

  useEffect(() => {
    const handleGlobalPointerMove = (event) => {
      // Only the card whose glow is currently active needs the outside-check;
      // the rest already reset, so skip the getBoundingClientRect entirely.
      if (!glowActiveRef.current) return
      const card = cardRef.current
      if (!card) return

      const rect = card.getBoundingClientRect()
      const isOutside = (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )

      if (isOutside) resetGlow()
    }

    window.addEventListener('pointermove', handleGlobalPointerMove, { passive: true })
    window.addEventListener('blur', resetGlow)

    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove)
      window.removeEventListener('blur', resetGlow)
    }
  }, [resetGlow])

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetGlow}
      onBlur={resetGlow}
      className={`border-glow-card ${className}`}
      style={{
        '--card-bg': backgroundColor,
        '--edge-sensitivity': edgeSensitivity,
        '--border-radius': `${borderRadius}px`,
        '--glow-padding': `${glowRadius}px`,
        '--cone-spread': coneSpread,
        '--fill-opacity': fillOpacity,
        ...buildGlowVars(glowColor, glowIntensity),
        ...buildGradientVars(colors),
      }}
    >
      <span className="edge-light" />
      <div className="border-glow-inner">
        {children}
      </div>
    </div>
  )
}
