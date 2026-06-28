import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'

import './Masonry.css'

const useMedia = (queries, values, defaultValue) => {
  const get = () => values[queries.findIndex((query) => matchMedia(query).matches)] ?? defaultValue

  const [value, setValue] = useState(get)

  useEffect(() => {
    const handler = () => setValue(get())
    queries.forEach((query) => matchMedia(query).addEventListener('change', handler))
    return () => queries.forEach((query) => matchMedia(query).removeEventListener('change', handler))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries])

  return value
}

const useMeasure = () => {
  const ref = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (!ref.current) return undefined

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })

    resizeObserver.observe(ref.current)
    return () => resizeObserver.disconnect()
  }, [])

  return [ref, size]
}

const preloadImages = async (urls) => {
  await Promise.all(
    urls.map(
      (src) => new Promise((resolve) => {
        const image = new Image()
        image.src = src
        image.onload = image.onerror = () => resolve()
      }),
    ),
  )
}

export default function Masonry({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
}) {
  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
    [4, 3, 2, 2],
    1,
  )

  const [containerRef, { width }] = useMeasure()
  const [imagesReady, setImagesReady] = useState(false)
  const hasMounted = useRef(false)

  const getInitialOffset = (item) => {
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (!containerRect) return { x: 0, y: 0 }

    let direction = animateFrom

    if (animateFrom === 'random') {
      const directions = ['top', 'bottom', 'left', 'right']
      direction = directions[Math.floor(Math.random() * directions.length)]
    }

    switch (direction) {
      case 'top':
        return { x: 0, y: -80 }
      case 'bottom':
        return { x: 0, y: 80 }
      case 'left':
        return { x: -80, y: 0 }
      case 'right':
        return { x: 80, y: 0 }
      case 'center':
        return {
          x: containerRect.width / 2 - item.x - item.w / 2,
          y: containerRect.height / 2 - item.y - item.h / 2,
        }
      default:
        return { x: 0, y: 100 }
    }
  }

  useEffect(() => {
    let isMounted = true
    setImagesReady(false)
    preloadImages(items.map((item) => item.img)).then(() => {
      if (isMounted) setImagesReady(true)
    })

    return () => {
      isMounted = false
    }
  }, [items])

  const { grid, containerHeight } = useMemo(() => {
    if (!width) return { grid: [], containerHeight: 0 }

    const colHeights = new Array(columns).fill(0)
    const columnWidth = width / columns

    const grid = items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights))
      const x = columnWidth * col
      const height = child.height / 2
      const y = colHeights[col]

      colHeights[col] += height

      return { ...child, x, y, w: columnWidth, h: height }
    })

    // The container height is the tallest column, so its frame hugs the content
    // instead of relying on a fixed CSS height that leaves empty space.
    return { grid, containerHeight: Math.max(...colHeights, 0) }
  }, [columns, items, width])

  useLayoutEffect(() => {
    if (!imagesReady) return undefined

    grid.forEach((item, index) => {
      const element = containerRef.current?.querySelector(`[data-key="${item.id}"]`)
      if (!element) return

      const animationProps = {
        x: 0,
        y: 0,
      }

      if (!hasMounted.current) {
        const initialOffset = getInitialOffset(item)
        const initialState = {
          opacity: 0,
          x: initialOffset.x,
          y: initialOffset.y,
          ...(blurToFocus && { filter: 'blur(10px)' }),
        }

        gsap.fromTo(element, initialState, {
          opacity: 1,
          ...animationProps,
          ...(blurToFocus && { filter: 'blur(0px)' }),
          duration: 0.8,
          ease: 'power3.out',
          delay: index * stagger,
          overwrite: 'auto',
        })
      } else {
        gsap.to(element, {
          ...animationProps,
          duration,
          ease,
          overwrite: 'auto',
        })
      }
    })

    hasMounted.current = true

    return () => {
      grid.forEach((item) => {
        const element = containerRef.current?.querySelector(`[data-key="${item.id}"]`)
        if (element) gsap.killTweensOf(element)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease])

  const handleMouseEnter = (event, item) => {
    const element = event.currentTarget

    if (scaleOnHover) {
      gsap.to(element, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay')
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0.3,
          duration: 0.3,
        })
      }
    }
  }

  const handleMouseLeave = (event, item) => {
    const element = event.currentTarget

    if (scaleOnHover) {
      gsap.to(element, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay')
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3,
        })
      }
    }
  }

  return (
    <div ref={containerRef} className="list" style={{ height: containerHeight }}>
      {grid.map((item) => (
        <button
          key={item.id}
          type="button"
          data-key={item.id}
          className="item-wrapper"
          style={{
            left: item.x,
            top: item.y,
            width: item.w,
            height: item.h,
          }}
          onClick={() => window.open(item.url, '_blank', 'noopener')}
          onMouseEnter={(event) => handleMouseEnter(event, item)}
          onMouseLeave={(event) => handleMouseLeave(event, item)}
          aria-label={item.alt || 'Open RoboMaster image'}
        >
          <span className="item-img" style={{ backgroundImage: `url(${item.img})` }}>
            {colorShiftOnHover && <span className="color-overlay" />}
          </span>
        </button>
      ))}
    </div>
  )
}
