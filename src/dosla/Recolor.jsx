import { useEffect, useRef, useState } from 'react'

// Live re-paint of a real photo. A grayscale mask (white = paint / leather) comes from
// work/stock.py. Each masked pixel keeps its own light and shade: its brightness
// relative to the body's median brightness drives the new colour, and highlights roll
// off to white, so reflections and panel shapes survive the colour change.

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
      let idx = null, lum = null, a = null, mid = 0.5
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
        // median body brightness (sampled) = the "flat panel" tone
        const step = Math.max(1, Math.floor(lum.length / 4000)), s = []
        for (let k = 0; k < lum.length; k += step) s.push(lum[k])
        s.sort((x, y) => x - y); mid = Math.max(0.04, s[Math.floor(s.length * 0.5)] || 0.5)
      }
      data.current = { ctx, base, idx, lum, a, mid, out: new ImageData(new Uint8ClampedArray(base.data), w, h) }
      setReady(true)
    }).catch(() => {})
    return () => { alive = false }
  }, [src, mask])

  useEffect(() => {
    const d = data.current
    if (!ready || !d) return
    const { ctx, base, idx, lum, a, mid, out } = d
    const px = base.data, o8 = out.data
    o8.set(px)
    if (idx && (color || finish !== 'gloss')) {
      const t = color ? hexRgb(color) : null
      const flat = FLAT[finish] ?? 1
      for (let k = 0; k < idx.length; k++) {
        const o = idx[k] * 4, l = lum[k]
        let shade = l / mid
        if (shade > 1) shade = 1 + (shade - 1) * flat
        else shade = 1 - (1 - shade) * (0.75 + 0.25 * flat)
        for (let ch = 0; ch < 3; ch++) {
          let v
          if (t) {
            const tc = t[ch]
            v = shade <= 1 ? tc * shade : tc + (1 - tc) * Math.min(1, (shade - 1) * mid / Math.max(0.05, 1 - mid))
          } else {
            v = (px[o + ch] / 255) * (l > 0.001 ? (shade * mid) / l : 1)
          }
          o8[o + ch] = px[o + ch] + (v * 255 - px[o + ch]) * a[k]
        }
      }
    }
    ctx.putImageData(out, 0, 0)
  }, [ready, color, finish])

  return <canvas ref={ref} className={`recolor ${ready ? 'ready' : ''} ${className}`} role="img" aria-label={alt} />
}
