import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import './PillNav.css'

function isExternalLink(href = '') {
  return href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#')
}

function NavLink({ children, className, href, ...props }) {
  if (!href || isExternalLink(href)) {
    return <a className={className} href={href || '#'} {...props}>{children}</a>
  }

  return <Link className={className} to={href} {...props}>{children}</Link>
}

export default function PillNav({
  items,
  activeHref,
  className = '',
  ease = 'power3.easeOut',
  baseColor = '#263f58',
  pillColor = '#ffffff',
  hoveredPillTextColor = '#ffffff',
  pillTextColor,
  initialLoadAnimation = true,
}) {
  const resolvedPillTextColor = pillTextColor ?? baseColor
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const circleRefs = useRef([])
  const tlRefs = useRef([])
  const activeTweenRefs = useRef([])
  const hamburgerRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const navItemsRef = useRef(null)

  const cssVars = useMemo(() => ({
    '--base': baseColor,
    '--pill-bg': pillColor,
    '--hover-text': hoveredPillTextColor,
    '--pill-text': resolvedPillTextColor,
  }), [baseColor, hoveredPillTextColor, pillColor, resolvedPillTextColor])

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return

        const pill = circle.parentElement
        const rect = pill.getBoundingClientRect()
        const { width, height } = rect
        const radius = ((width * width) / 4 + height * height) / (2 * height)
        const diameter = Math.ceil(2 * radius) + 2
        const delta = Math.ceil(radius - Math.sqrt(Math.max(0, radius * radius - (width * width) / 4))) + 1
        const originY = diameter - delta

        circle.style.width = `${diameter}px`
        circle.style.height = `${diameter}px`
        circle.style.bottom = `-${delta}px`

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        })

        const label = pill.querySelector('.pill-label')
        const hoverLabel = pill.querySelector('.pill-label-hover')

        if (label) gsap.set(label, { y: 0 })
        if (hoverLabel) gsap.set(hoverLabel, { y: height + 12, opacity: 0 })

        tlRefs.current[index]?.kill()
        const timeline = gsap.timeline({ paused: true })
        timeline.to(circle, { scale: 1.16, xPercent: -50, duration: 1.7, ease, overwrite: 'auto' }, 0)

        if (label) {
          timeline.to(label, { y: -(height + 8), duration: 1.7, ease, overwrite: 'auto' }, 0)
        }

        if (hoverLabel) {
          gsap.set(hoverLabel, { y: Math.ceil(height + 100), opacity: 0 })
          timeline.to(hoverLabel, { y: 0, opacity: 1, duration: 1.7, ease, overwrite: 'auto' }, 0)
        }

        tlRefs.current[index] = timeline
      })
    }

    layout()
    window.addEventListener('resize', layout)
    document.fonts?.ready?.then(layout).catch(() => {})

    if (mobileMenuRef.current) {
      gsap.set(mobileMenuRef.current, { visibility: 'hidden', opacity: 0, y: 10 })
    }

    if (initialLoadAnimation && navItemsRef.current) {
      gsap.set(navItemsRef.current, { opacity: 0, y: -6 })
      gsap.to(navItemsRef.current, { opacity: 1, y: 0, duration: 0.55, ease })
    }

    return () => {
      window.removeEventListener('resize', layout)
      tlRefs.current.forEach((timeline) => timeline?.kill())
      activeTweenRefs.current.forEach((tween) => tween?.kill())
    }
  }, [items, ease, initialLoadAnimation])

  const handleEnter = (index) => {
    const timeline = tlRefs.current[index]
    if (!timeline) return
    activeTweenRefs.current[index]?.kill()
    activeTweenRefs.current[index] = timeline.tweenTo(timeline.duration(), {
      duration: 0.28,
      ease,
      overwrite: 'auto',
    })
  }

  const handleLeave = (index) => {
    const timeline = tlRefs.current[index]
    if (!timeline) return
    activeTweenRefs.current[index]?.kill()
    activeTweenRefs.current[index] = timeline.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: 'auto',
    })
  }

  const setMobileMenu = (open) => {
    setIsMobileMenuOpen(open)

    const lines = hamburgerRef.current?.querySelectorAll('.hamburger-line')
    if (lines?.length === 2) {
      gsap.to(lines[0], { rotation: open ? 45 : 0, y: open ? 3 : 0, duration: 0.24, ease })
      gsap.to(lines[1], { rotation: open ? -45 : 0, y: open ? -3 : 0, duration: 0.24, ease })
    }

    const menu = mobileMenuRef.current
    if (!menu) return

    if (open) {
      gsap.set(menu, { visibility: 'visible' })
      gsap.fromTo(menu, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.26, ease, overwrite: 'auto' })
      return
    }

    gsap.to(menu, {
      opacity: 0,
      y: 10,
      duration: 0.18,
      ease,
      overwrite: 'auto',
      onComplete: () => gsap.set(menu, { visibility: 'hidden' }),
    })
  }

  return (
    <div className={`pill-nav-container ${className}`} style={cssVars}>
      <nav className="pill-nav" aria-label="Primary navigation">
        <div className="pill-nav-items desktop-only" ref={navItemsRef}>
          <ul className="pill-list" role="menubar">
            {items.map((item, index) => (
              <li key={item.href || item.label} role="none">
                <NavLink
                  role="menuitem"
                  href={item.href}
                  className={`pill${activeHref === item.href ? ' is-active' : ''}`}
                  aria-label={item.ariaLabel || item.label}
                  onMouseEnter={() => handleEnter(index)}
                  onMouseLeave={() => handleLeave(index)}
                >
                  <span
                    className="hover-circle"
                    aria-hidden="true"
                    ref={(el) => {
                      circleRefs.current[index] = el
                    }}
                  />
                  <span className="label-stack">
                    <span className="pill-label">{item.label}</span>
                    <span className="pill-label-hover" aria-hidden="true">{item.label}</span>
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <button
          className="mobile-menu-button mobile-only"
          type="button"
          onClick={() => setMobileMenu(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          ref={hamburgerRef}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      <div className="mobile-menu-popover mobile-only" ref={mobileMenuRef}>
        <ul className="mobile-menu-list">
          {items.map((item) => (
            <li key={item.href || item.label}>
              <NavLink
                href={item.href}
                className={`mobile-menu-link${activeHref === item.href ? ' is-active' : ''}`}
                onClick={() => setMobileMenu(false)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
