import { useEffect } from 'react'
import Lenis from 'lenis'

// One Lenis instance for the whole app: smooth, eased wheel/touch scrolling.
let lenis = null
export function getLenis() { return lenis }

export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true })
    let id
    const raf = (time) => { lenis.raf(time); id = requestAnimationFrame(raf) }
    id = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(id); lenis.destroy(); lenis = null }
  }, [])
}

export function scrollTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true })
  else window.scrollTo(0, 0)
}

// Scroll-triggered motion. Re-run whenever the page (route) changes.
//  data-reveal="up|left|right|zoom|clip|fade"  + optional data-delay="120" (ms)
//  data-parallax="0.15"   moves at a fraction of scroll speed (uses the `translate`
//                         property so it composes with any existing `transform`)
//  data-count="820"       counts up from 0 when revealed (keeps decimals of the target)
export function useScrollMotion(key) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const els = [...document.querySelectorAll('[data-reveal]')]
    els.forEach((el) => { if (el.dataset.delay) el.style.transitionDelay = `${el.dataset.delay}ms` })

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        e.target.classList.add('in')
        e.target.querySelectorAll?.('[data-count]').forEach(countUp)
        if (e.target.dataset.count) countUp(e.target)
        io.unobserve(e.target)
      })
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' })
    els.forEach((el) => (reduce ? el.classList.add('in') : io.observe(el)))

    const counters = [...document.querySelectorAll('[data-count]')].filter((c) => !c.closest('[data-reveal]') && !c.dataset.reveal)
    counters.forEach((c) => io.observe(c))

    // Parallax: offset is 0 when the element sits where the layout put it (centred in the
    // viewport, or at scroll 0 for anything above the fold) and lags/leads from there.
    const par = [...document.querySelectorAll('[data-parallax]')]
    let starts = []
    const measure = () => {
      par.forEach((el) => { el.style.translate = '' })
      const vh = window.innerHeight
      starts = par.map((el) => {
        const r = el.getBoundingClientRect()
        return Math.max(0, r.top + window.scrollY + r.height / 2 - vh / 2)
      })
    }
    let ticking = false
    const update = () => {
      ticking = false
      const y = window.scrollY
      par.forEach((el, i) => { el.style.translate = `0 ${((y - starts[i]) * parseFloat(el.dataset.parallax)).toFixed(1)}px` })
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update) } }
    const onResize = () => { measure(); update() }
    if (!reduce && par.length) {
      measure(); update()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onResize)
    }

    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize) }
  }, [key])
}

function countUp(el) {
  if (el.dataset.counted) return
  el.dataset.counted = '1'
  const target = parseFloat(el.dataset.count)
  const dec = (el.dataset.count.split('.')[1] || '').length
  const t0 = performance.now(), dur = 1400
  const step = (now) => {
    const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3)
    el.textContent = (target * e).toFixed(dec)
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
