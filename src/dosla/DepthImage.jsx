import { useEffect, useRef, useState } from 'react'

// 2.5D "3D photo": a colour image + a depth map (white = near) rendered in WebGL.
// Each pixel is shifted by (depth - focus) * camera offset, so near parts move more
// than far parts as the pointer moves, which reads as real volume.
// The depth maps are made locally with Depth Anything V2 (see docs/IMAGE-WORKFLOWS.md).

const VERT = `attribute vec2 p; varying vec2 v; void main(){ v = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`
const FRAG = `precision mediump float;
varying vec2 v; uniform sampler2D img; uniform sampler2D dep; uniform vec2 off; uniform float focus;
void main(){
  float d = texture2D(dep, v).r;
  vec2 u = v + off * (d - focus);
  d = texture2D(dep, u).r;            // second pass: sample depth where we landed (fewer tears)
  u = v + off * (d - focus);
  gl_FragColor = texture2D(img, clamp(u, .001, .999));
}`

function load(src) {
  return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src })
}

export default function DepthImage({ src, depth, className, style, alt = '', strength = 0.02, focus = 0.5, drift = 0.35 }) {
  const ref = useRef(null)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    const canvas = ref.current
    const gl = canvas?.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false })
    if (!gl) { setFallback(true); return }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0, alive = true, visible = true

    const sh = (type, s) => { const o = gl.createShader(type); gl.shaderSource(o, s); gl.compileShader(o); return o }
    const prog = gl.createProgram()
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { setFallback(true); return }
    gl.useProgram(prog)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const uOff = gl.getUniformLocation(prog, 'off')
    gl.uniform1f(gl.getUniformLocation(prog, 'focus'), focus)

    const tex = (img, unit, name) => {
      const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.uniform1i(gl.getUniformLocation(prog, name), unit)
    }

    // pointer target in -1..1, eased toward each frame
    const target = { x: 0, y: 0 }, cur = { x: 0, y: 0 }
    const onMove = (e) => { target.x = (e.clientX / window.innerWidth) * 2 - 1; target.y = (e.clientY / window.innerHeight) * 2 - 1 }
    const onLeave = () => { target.x = 0; target.y = 0 }

    const resize = () => {
      const r = canvas.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr))
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h) }
    }

    const frame = (t) => {
      if (!alive) return
      raf = requestAnimationFrame(frame)
      if (!visible) return
      resize()
      const k = reduce ? 1 : 0.06
      cur.x += (target.x - cur.x) * k; cur.y += (target.y - cur.y) * k
      const dx = reduce ? 0 : drift * Math.sin(t * 0.00045), dy = reduce ? 0 : drift * 0.6 * Math.cos(t * 0.00033)
      gl.uniform2f(uOff, -(cur.x + dx) * strength, (cur.y + dy) * strength)
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(canvas)

    Promise.all([load(src), load(depth)]).then(([img, dep]) => {
      if (!alive) return
      canvas.style.aspectRatio = canvas.style.aspectRatio || `${img.naturalWidth} / ${img.naturalHeight}`
      tex(img, 0, 'img'); tex(dep, 1, 'dep')
      if (!reduce) { window.addEventListener('pointermove', onMove, { passive: true }); document.addEventListener('pointerleave', onLeave) }
      raf = requestAnimationFrame(frame)
    }).catch(() => setFallback(true))

    return () => {
      alive = false; cancelAnimationFrame(raf); io.disconnect()
      window.removeEventListener('pointermove', onMove); document.removeEventListener('pointerleave', onLeave)
    }
  }, [src, depth, strength, focus, drift])

  if (fallback) return <img className={className} style={style} src={src} alt={alt} />
  return <canvas ref={ref} className={className} style={style} role="img" aria-label={alt} />
}
