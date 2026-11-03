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

    const reveal = (el) => {
      el.classList.add('in')
      const d = parseFloat(el.dataset.delay) || 0
      setTimeout(() => { el.style.transitionDelay = '' }, d + 1500)
      el.querySelectorAll?.('[data-count]').forEach(countUp)
      if (el.dataset.count) countUp(el)
    }
    const onHit = (obs) => (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return
      reveal(e.target); obs.unobserve(e.target)
    })
    const io = new IntersectionObserver((entries) => onHit(io)(entries), { threshold: 0.18, rootMargin: '0px 0px -6% 0px' })
    // Clip reveals start almost fully clipped (a 1px sliver stays visible so the observer
    // can see them), so they need a zero threshold.
    const clipIO = new IntersectionObserver((entries) => onHit(clipIO)(entries), { threshold: 0, rootMargin: '0px 0px -10% 0px' })
    els.forEach((el) => {
      if (reduce) return el.classList.add('in')
      ;(el.dataset.reveal === 'clip' ? clipIO : io).observe(el)
    })

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
    // Scroll-linked 3D: sections marked data-s3d get two live CSS variables
    //  --c  -1 → 1 as the section travels from bottom to top of the viewport (0 = centred)
    //  --x   0 → 1 as the section scrolls out above the top edge (exit progress)
    const s3d = [...document.querySelectorAll('[data-s3d]')]
    let ticking = false
    const update = () => {
      ticking = false
      const y = window.scrollY, vh = window.innerHeight
      par.forEach((el, i) => { el.style.translate = `0 ${((y - starts[i]) * parseFloat(el.dataset.parallax)).toFixed(1)}px` })
      s3d.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.bottom < -200 || r.top > vh + 200) return
        const c = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)))
        const x = Math.max(0, Math.min(1, -r.top / r.height))
        el.style.setProperty('--c', c.toFixed(4))
        el.style.setProperty('--x', x.toFixed(4))
      })
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update) } }
    const onResize = () => { measure(); update() }
    if (!reduce && (par.length || s3d.length)) {
      measure(); update()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onResize)
    }

    // 3D hover tilt: cards lean toward the pointer, with a moving highlight.
    const tilts = reduce || window.matchMedia('(hover: none)').matches ? [] : [...document.querySelectorAll('[data-tilt]')]
    const move = (e) => {
      const el = e.currentTarget, r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
      const max = parseFloat(el.dataset.tilt) || 8
      el.style.setProperty('--ry', `${((px - 0.5) * 2 * max).toFixed(2)}deg`)
      el.style.setProperty('--rx', `${((0.5 - py) * 2 * max).toFixed(2)}deg`)
      el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`)
      el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`)
      el.classList.add('tilting')
    }
    const leave = (e) => {
      const el = e.currentTarget
      el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); el.classList.remove('tilting')
    }
    tilts.forEach((el) => { el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave) })

    return () => {
      io.disconnect(); clipIO.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize)
      tilts.forEach((el) => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) })
    }
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
