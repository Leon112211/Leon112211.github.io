import { createContext, useCallback, useContext, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'

const TransitionContext = createContext(null)

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Route transition: the page content (everything except the fixed header, which lives
 * outside this stage) slides left and blurs out, the route swaps while hidden, then the
 * new page slides in from the right as the blur clears. Honors reduced motion (instant)
 * and middle/modifier clicks. The stage's inline transform/filter is fully cleared at
 * rest so the sticky year-headings inside behave normally.
 */
export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const stageRef = useRef(null)
  const animatingRef = useRef(false)

  const navigateWithTransition = useCallback(
    (to) => {
      const stage = stageRef.current
      if (animatingRef.current) return // ignore clicks while a transition is mid-flight
      if (!stage || prefersReduced()) {
        navigate(to)
        return
      }

      animatingRef.current = true
      gsap.killTweensOf(stage)
      const tl = gsap.timeline({
        onComplete: () => {
          animatingRef.current = false
        },
      })
      // exit: current content slides left and blurs away
      tl.to(stage, { xPercent: -10, autoAlpha: 0, filter: 'blur(16px)', duration: 0.32, ease: 'power2.in' })
      // swap the route while hidden, then position the new page instantly (before reveal)
      tl.add(() => {
        navigate(to)
        requestAnimationFrame(() => {
          const sectionMatch = /[?&]section=([^&#]+)/.exec(to)
          const target = sectionMatch && document.getElementById(sectionMatch[1])
          if (target) target.scrollIntoView({ block: 'start' })
          else window.scrollTo(0, 0)
        })
      })
      // enter: new content slides in from the right as the blur clears
      tl.set(stage, { xPercent: 10 })
      tl.to(stage, { xPercent: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.5, ease: 'expo.out' })
      // clear inline transform/filter so fixed/sticky descendants behave normally at rest
      tl.set(stage, { clearProps: 'all' })
    },
    [navigate],
  )

  return (
    <TransitionContext.Provider value={navigateWithTransition}>
      <div ref={stageRef} className="route-stage">
        {children}
      </div>
    </TransitionContext.Provider>
  )
}

export function useTransitionNavigate() {
  return useContext(TransitionContext)
}

/** Drop-in <Link> replacement that plays the slide/blur transition for in-app route changes. */
export function TransitionLink({ to, children, onClick, ...rest }) {
  const navigateWithTransition = useTransitionNavigate()

  const handleClick = (event) => {
    if (onClick) onClick(event)
    // let the browser handle new-tab / modified clicks and any non-primary button
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !navigateWithTransition
    ) {
      return
    }
    event.preventDefault()
    navigateWithTransition(to)
  }

  return (
    <Link to={to} onClick={handleClick} {...rest}>
      {children}
    </Link>
  )
}
