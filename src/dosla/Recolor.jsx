import { useEffect, useRef, useState } from 'react'

// Live re-paint of a real photo. A grayscale mask (white = paint / leather) comes from
// work/stock.py. Each masked pixel keeps its own light and shade: where its brightness
// sits inside the body's own range (darkest → brightest panel) drives the new colour,
// and only the brightest few percent become white gloss, so reflections and panel
// shapes survive the change on white, red or silver source cars alike.

const load = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src })
const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
// how much of the highlight range each finish keeps (matte flattens reflections)
const FLAT = { gloss: 1, satin: 0.6, matte: 0.3 }

export default function Recolor({ src, mask, color, finish = 'gloss', alt = '', className = '' }) {
  const ref = useRef(null)
  const data = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let alive = true
    setReady(false); data.current = null
    // a missing mask must never hide the photo: fall back to showing it unpainted
    Promise.all([load(src), mask ? load(mask).catch(() => null) : Promise.resolve(null)]).then(([img, mk]) => {
      if (!alive) return
      const w = img.naturalWidth, h = img.naturalHeight
      const c = ref.current; c.width = w; c.height = h
      const ctx = c.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(img, 0, 0)
      const base = ctx.getImageData(0, 0, w, h)
      let idx = null, lum = null, a = null, lo = 0, hi = 1
      if (mk) {
        ctx.drawImage(mk, 0, 0, w, h)
        const m = ctx.getImageData(0, 0, w, h).data
        ctx.putImageData(base, 0, 0)
        const list = []
        for (let p = 0; p < w * h; p++) if (m[p * 4] > 8) list.push(p)
        idx = new Uint32Array(list); lum = new Float32Array(idx.length); a = new Float32Array(idx.length)
        const px = base.data
        for (let k = 0; k < idx.length; k++) {
          const o = idx[k] * 4
          lum[k] = (0.2126 * px[o] + 0.7152 * px[o + 1] + 0.0722 * px[o + 2]) / 255
          a[k] = m[o] / 255
        }
        // the body's own brightness range (sampled): 3rd and 97th percentile
        const step = Math.max(1, Math.floor(lum.length / 6000)), s = []
        for (let k = 0; k < lum.length; k += step) s.push(lum[k])
        s.sort((x, y) => x - y)
        lo = s[Math.floor(s.length * 0.03)] ?? 0; hi = s[Math.floor(s.length * 0.97)] ?? 1
        if (hi - lo < 0.08) { const c = (hi + lo) / 2; lo = c - 0.04; hi = c + 0.04 }
      }
      data.current = { ctx, base, idx, lum, a, lo, hi, out: new ImageData(new Uint8ClampedArray(base.data), w, h) }
      setReady(true)
    }).catch(() => {})
    return () => { alive = false }
  }, [src, mask])

  useEffect(() => {
    const d = data.current
    if (!ready || !d) return
    const { ctx, base, idx, lum, a, lo, hi, out } = d
    const px = base.data, o8 = out.data
    o8.set(px)
    if (idx && (color || finish !== 'gloss')) {
      const t = color ? hexRgb(color) : null
      const flat = FLAT[finish] ?? 1
      const span = hi - lo
      // shade from where the pixel sits in the body's OWN range (0 = darkest panel, 1 = brightest),
      // so white, red or silver source cars all repaint evenly; only the top few percent turn
      // into white gloss highlights (fewer for satin / matte)
      const shadeOf = (q) => 0.32 + 0.9 * q
      for (let k = 0; k < idx.length; k++) {
        const o = idx[k] * 4, l = lum[k]
        let q = Math.min(1.15, Math.max(0, (l - lo) / span))
        const q0 = q
        q = 0.55 + (q - 0.55) * (0.55 + 0.45 * flat)
        const sh = shadeOf(Math.min(1, q))
        const gloss = flat * Math.max(0, (q0 - 0.93) / 0.22) ** 1.5
        for (let ch = 0; ch < 3; ch++) {
          let v
          if (t) {
            v = Math.min(1, t[ch] * sh + Math.max(0, sh - 1) * 0.5)
            v = v + (1 - v) * Math.min(0.85, gloss)
          } else {
            v = (px[o + ch] / 255) * (shadeOf(Math.min(1, q)) / shadeOf(Math.min(1, q0)))
          }
          o8[o + ch] = px[o + ch] + (v * 255 - px[o + ch]) * a[k]
        }
      }
    }
    ctx.putImageData(out, 0, 0)
  }, [ready, color, finish])

  return <canvas ref={ref} className={`recolor ${ready ? 'ready' : ''} ${className}`} role="img" aria-label={alt} />
}
