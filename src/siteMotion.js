import { useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'

// --- one-time, module-scope plugin + ease registration (idempotent under StrictMode) ---
let registered = false
function ensureRegistered() {
  if (registered) return
  registered = true
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)
  gsap.config({ nullTargetWarn: false })
  ScrollTrigger.config({ ignoreMobileResize: true })
  // Strictly monotonic curves (max value == 1) => fast attack, long silky tail, ZERO bounce.
  CustomEase.create('settle', 'M0,0 C0.16,1 0.3,1 1,1')
  CustomEase.create('lux', 'M0,0 C0.22,1 0.36,1 1,1')
}

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// useLayoutEffect so the initial hidden state is set BEFORE first paint (no flash).
// This is a client-only SPA, so layout effects are safe.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * High-end homepage choreography: a hero opening master timeline (masked-character
 * title with a compress-then-settle) plus per-module scroll reveals (big English
 * heading first, then staggered cards with a clip-path unmask). Transform / opacity /
 * clip-path only; all monotonic eases; sticky-safe; FOUC- and reduced-motion-safe.
 */
export function useHomeMotion(rootRef) {
  const { pathname } = useLocation()

  useIsoLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    ensureRegistered()
    if (prefersReduced()) return undefined // reduced motion: stay fully visible, run nothing

    const q = gsap.utils.selector(root)
    const splits = []
    let raf = 0
    let cancelled = false

    // Pre-hide above-/near-fold elements synchronously (pre-paint) to avoid any flash.
    const preHide = [
      '.academic-hero-copy > .academic-kicker',
      '.academic-hero-copy h1',
      '.academic-hero-copy h2',
      '.academic-hero-copy > p:not(.academic-kicker)',
      '.academic-hero-actions .academic-button',
      '.academic-profile-dossier',
      '.academic-hero-about-band .academic-kicker',
      '.academic-hero-about-heading h3',
      '.academic-hero-about-copy > p',
    ].flatMap((selector) => q(selector))

    const ctx = gsap.context(() => {
      gsap.set(preHide, { autoAlpha: 0 })
    }, root)

    const build = () => {
      if (cancelled || !rootRef.current) return
      ctx.add(() => buildHomeTimeline(q, splits))
      raf = requestAnimationFrame(() => ScrollTrigger.refresh())
    }

    // Split only after fonts are ready (serif metrics shift line-wrapping otherwise).
    document.fonts.ready.then(build)
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.removeEventListener('load', onLoad)
      splits.forEach((split) => split.revert()) // undo SplitText DOM wrapping first
      ctx.revert() // kill tweens + ScrollTriggers + clear inline styles
    }
  }, [pathname, rootRef])
}

function buildHomeTimeline(q, splits) {
  // ---- SplitText first (it reflows layout) ----
  const h1 = q('.academic-hero-copy h1')[0]
  const heroSub = q('.academic-hero-copy h2')[0]
  const aboutH3 = q('.academic-hero-about-heading h3')[0]
  const projectsH2 = q('.academic-projects-heading h2')[0]
  const contactH2 = q('.academic-contact-card h2')[0]

  const titleSplit = h1 && new SplitText(h1, { type: 'chars,lines', linesClass: 'hero-h1-line', charsClass: 'hero-char' })
  const subSplit = heroSub && new SplitText(heroSub, { type: 'lines', linesClass: 'hero-mask-line' })
  const aboutSplit = aboutH3 && new SplitText(aboutH3, { type: 'lines', linesClass: 'mask-line' })
  const projectsSplit = projectsH2 && new SplitText(projectsH2, { type: 'lines', linesClass: 'mask-line' })
  const contactSplit = contactH2 && new SplitText(contactH2, { type: 'lines', linesClass: 'mask-line' })
  ;[titleSplit, subSplit, aboutSplit, projectsSplit, contactSplit].forEach((split) => {
    if (split) splits.push(split)
  })

  // ================= HERO MASTER TIMELINE (plays on load) =================
  const heroKicker = q('.academic-hero-copy > .academic-kicker')
  const introP = q('.academic-hero-copy > p:not(.academic-kicker)')
  const dossier = q('.academic-profile-dossier')
  const dossierRows = q('.academic-profile-dossier dl > div')
  const actions = q('.academic-hero-actions .academic-button')

  // The split-heading parents were pre-hidden; make them visible — the reveal now
  // comes from the masked children sitting below their clip baseline.
  gsap.set([h1, heroSub].filter(Boolean), { autoAlpha: 1 })
  if (titleSplit) gsap.set(titleSplit.chars, { yPercent: 118, scaleY: 1.22, transformOrigin: '50% 100%', willChange: 'transform' })
  if (subSplit) gsap.set(subSplit.lines, { yPercent: 120, autoAlpha: 0 })
  gsap.set(heroKicker, { yPercent: 130, autoAlpha: 0 })
  gsap.set(introP, { y: 22, autoAlpha: 0 })
  gsap.set(dossier, { xPercent: 6, autoAlpha: 0, willChange: 'transform' })
  gsap.set(dossierRows, { x: 18, autoAlpha: 0 })
  gsap.set(actions, { y: 24, autoAlpha: 0 })

  const heroTl = gsap.timeline({
    defaults: { ease: 'expo.out' },
    onComplete: () => {
      gsap.set([...(titleSplit ? titleSplit.chars : []), dossier, dossierRows, actions], { willChange: 'auto' })
      ScrollTrigger.refresh()
    },
  })
  heroTl.to(heroKicker, { yPercent: 0, autoAlpha: 1, duration: 0.7 }, 0)
  if (titleSplit) {
    // THE SIGNATURE: glyphs first slide up out of the line mask still compressed (tall),
    // then settle their weight as a distinct follow-through beat — a readable
    // "rise, then settle", never a bounce.
    heroTl.to(titleSplit.chars, { yPercent: 0, duration: 1.1, ease: 'settle', stagger: { each: 0.05, from: 'start' } }, 0.2)
    heroTl.to(titleSplit.chars, { scaleY: 1, duration: 1.05, ease: 'settle', stagger: { each: 0.05, from: 'start' } }, 0.32)
    heroTl.fromTo(h1, { letterSpacing: '-0.05em' }, { letterSpacing: '0em', duration: 1.2, ease: 'settle' }, 0.2)
  }
  if (subSplit) heroTl.to(subSplit.lines, { yPercent: 0, autoAlpha: 1, duration: 0.9, stagger: 0.1 }, 0.55)
  heroTl.to(dossier, { xPercent: 0, autoAlpha: 1, duration: 1.05 }, 0.7)
  heroTl.to(introP, { y: 0, autoAlpha: 1, duration: 1.0, ease: 'power3.out' }, 0.85)
  heroTl.to(dossierRows, { x: 0, autoAlpha: 1, duration: 0.6, ease: 'power2.out', stagger: 0.08 }, 0.95)
  heroTl.to(actions, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out', stagger: 0.1 }, 1.15)

  // ================= ABOUT BAND (scroll module: heading first, then copy) =================
  const aboutBand = q('.academic-hero-about-band')[0]
  if (aboutBand) {
    const aboutKicker = q('.academic-hero-about-heading .academic-kicker')
    const aboutCopy = q('.academic-hero-about-copy > p')
    if (aboutSplit) {
      gsap.set(aboutH3, { autoAlpha: 1 })
      gsap.set(aboutSplit.lines, { yPercent: 120, autoAlpha: 0 })
    }
    gsap.set(aboutKicker, { yPercent: 130, autoAlpha: 0 })
    gsap.set(aboutCopy, { y: 22, autoAlpha: 0 })
    const tl = gsap.timeline({ scrollTrigger: { trigger: aboutBand, start: 'top 80%', toggleActions: 'play none none reverse' } })
    tl.to(aboutKicker, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out' })
    if (aboutSplit) tl.to(aboutSplit.lines, { yPercent: 0, autoAlpha: 1, duration: 0.95, ease: 'settle', stagger: 0.12 }, 0.1)
    tl.to(aboutCopy, { y: 0, autoAlpha: 1, duration: 0.85, ease: 'power3.out', stagger: 0.12 }, 0.45)
  }

  // ================= PROJECTS HEADING (big English heading enters first) =================
  const projHeading = q('.academic-projects-heading')[0]
  if (projHeading) {
    const projKicker = q('.academic-projects-heading > .academic-kicker')
    const projTrailP = q('.academic-projects-heading > p:last-child')
    if (projectsSplit) {
      gsap.set(projectsH2, { autoAlpha: 1 })
      gsap.set(projectsSplit.lines, { yPercent: 120, autoAlpha: 0 })
    }
    gsap.set(projKicker, { yPercent: 130, autoAlpha: 0 })
    gsap.set(projTrailP, { y: 20, autoAlpha: 0 })
    const tl = gsap.timeline({ scrollTrigger: { trigger: projHeading, start: 'top 80%', toggleActions: 'play none none reverse' } })
    // Lead gap so this heading enters slightly AFTER the timeline years/cards below it.
    const lead = 0.3
    tl.to(projKicker, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out' }, lead)
    if (projectsSplit) tl.to(projectsSplit.lines, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'lux', stagger: 0.09 }, lead + 0.08)
    tl.to(projTrailP, { y: 0, autoAlpha: 1, duration: 0.55, ease: 'power3.out' }, lead + 0.36)
  }

  // ================= YEAR HEADINGS (sticky-safe micro rise on the h3 only) =================
  q('.academic-project-year').forEach((yearEl) => {
    const yh = yearEl.querySelector('.academic-project-year-heading h3')
    if (!yh) return
    // Bidirectional: rises in on enter, reverses out on scroll-back. Only the h3 itself
    // is transformed (its end state is an identity transform), never the sticky ancestor.
    // Match the card slide: same distance / duration / long-tail ease so the year
    // number rises up in step with its cards. Only the h3 is transformed (its end
    // state is identity), never the sticky ancestor.
    gsap.from(yh, {
      y: 100,
      autoAlpha: 0,
      duration: 1.35,
      ease: 'expo.out',
      scrollTrigger: { trigger: yearEl, start: 'top 82%', toggleActions: 'play none none reverse' },
    })
  })

  // ================= CARD CASCADE (slide up from below, decelerate, stop) =================
  const glows = q('.academic-project-glow')
  if (glows.length) {
    // start each card below its resting place and hidden; transform/opacity on the
    // glow root is BorderGlow-safe.
    gsap.set(glows, { autoAlpha: 0, y: 100, willChange: 'transform' })
    // expo.out = quick attack then a long, drawn-out tail, so the final stretch of
    // the slide settles very slowly to rest (no bounce).
    const revealCards = (batch) => {
      gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.35, ease: 'expo.out', stagger: { each: 0.13, from: 'start' }, overwrite: true })
    }
    const hideCards = (batch) => {
      gsap.to(batch, { autoAlpha: 0, y: 100, duration: 0.55, ease: 'power2.in', stagger: { each: 0.08, from: 'end' }, overwrite: true })
    }
    ScrollTrigger.batch(glows, {
      start: 'top 85%',
      onEnter: revealCards, // scrolling down into view -> slide up to rest
      onLeaveBack: hideCards, // scrolling back up out of view -> reverse out
    })
  }

  // ================= CONTACT (heading mask rise, then links) =================
  const contact = q('.academic-contact')[0]
  if (contact) {
    const contactLinks = q('.academic-contact-links a')
    if (contactSplit) {
      gsap.set(contactH2, { autoAlpha: 1 })
      gsap.set(contactSplit.lines, { yPercent: 115, autoAlpha: 0 })
    }
    gsap.set(contactLinks, { y: 18, autoAlpha: 0 })
    const tl = gsap.timeline({ scrollTrigger: { trigger: contact, start: 'top 85%', toggleActions: 'play none none reverse' } })
    if (contactSplit) tl.to(contactSplit.lines, { yPercent: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out', stagger: 0.12 })
    tl.to(contactLinks, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out', stagger: 0.08 }, 0.3)
  }
}

/**
 * Project-detail route: reveal media images with a bottom-up clip-path wipe as they
 * scroll into view. clip-path is applied to the <img> only, so there is no layout/edge
 * risk and Masonry/iframe media are untouched.
 */
export function useMediaReveal(rootRef) {
  const { pathname } = useLocation()

  useIsoLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    ensureRegistered()
    if (prefersReduced()) return undefined

    const q = gsap.utils.selector(root)
    let raf = 0
    let cancelled = false
    const ctx = gsap.context(() => {}, root)

    // Full-screen "page" sections: hide synchronously (no flash), then fade + slide up on scroll.
    const sectionEls = q(
      '.project-brief, .project-controller-integration, .project-context, .project-video-evidence, .project-research-report, .project-independent-experience, .project-detail-media',
    )
    ctx.add(() => {
      gsap.set(sectionEls, { autoAlpha: 0, y: 48 })
    })

    const build = () => {
      if (cancelled || !rootRef.current) return
      ctx.add(() => {
        sectionEls.forEach((section) => {
          gsap.to(section, {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 82%', toggleActions: 'play none none reverse' },
          })
        })

        const imgs = [
          '.project-research-report__figure img',
          '.detail-media-card > img',
          '.project-context-item img',
          '.project-controller-integration__certificate img',
        ].flatMap((selector) => q(selector))
        imgs.forEach((img) => {
          gsap.fromTo(
            img,
            { clipPath: 'inset(0% 0% 100% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 1.1,
              ease: 'expo.out',
              scrollTrigger: { trigger: img, start: 'top 85%', toggleActions: 'play none none reverse' },
            },
          )
        })
      })
      raf = requestAnimationFrame(() => ScrollTrigger.refresh())
    }

    document.fonts.ready.then(build)
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.removeEventListener('load', onLoad)
      ctx.revert()
    }
  }, [pathname, rootRef])
}
