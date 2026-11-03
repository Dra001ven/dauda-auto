import { useEffect, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, X, MapPin, Clock, Phone, Check } from 'lucide-react'
import { I } from './icons'

/* Shared page banner: every page opens differently, but keeps the nav legible. */
function Kicker({ children, red }) {
  return <p className={`kicker${red ? ' red' : ''}`}>{children}</p>
}

/* =============================================================== MODEL ==== */
/* A configurator: giant outlined name, real photo recoloured per paint. */
const paints = [
  { id: 'rosso', name: 'Rosso Corsa', hex: '#b3141c' },
  { id: 'giallo', name: 'Giallo Modena', hex: '#e2b21a' },
  { id: 'blu', name: 'Blu Pozzi', hex: '#1d3c9c' },
  { id: 'verde', name: 'Verde Brit', hex: '#1f6b34' },
  { id: 'nero', name: 'Nero Daytona', hex: '#141414' },
  { id: 'bianco', name: 'Bianco Avus', hex: '#efeeea' },
]
const specs = [
  ['Engine', '3.9 L twin-turbo V8 + 2 e-motors'], ['Power', '820 cv @ 7,500 rpm'], ['Torque', '900 Nm'],
  ['0–100 km/h', '3.1 s'], ['Top speed', '350 km/h'], ['Dry weight', '1,420 kg'],
]
const trims = [
  { n: 'Stradale', p: '€ 398,000', d: 'The road-going benchmark. Carbon ceramic brakes, adaptive damping, daily comfort.' },
  { n: 'Assetto Fiorano', p: '€ 452,000', d: 'Lightweight pack: titanium exhaust, Lexan rear screen, multimatic shocks, -30 kg.' },
  { n: 'Corsa Clienti', p: 'By invitation', d: 'Track-only programme with factory engineers at Mugello, Spa and Fiorano.' },
]

export function ModelPage() {
  const [paint, setPaint] = useState(paints[0])
  return (
    <div className="pg pg-model">
      <section className="cfg">
        <h1 className="ghost" data-parallax="-0.15">IL CORSA</h1>
        <div className="cfg-head" data-reveal="up">
          <Kicker red>Configure your</Kicker>
          <h2>IL CORSA <b>{paint.name}</b></h2>
        </div>
        <div className="cfg-stage">
          {paints.map((p) => (
            <img key={p.id} className={p.id === paint.id ? 'on' : ''} src={`/img/paint-${p.id}.png`} alt={`IL CORSA in ${p.name}`} />
          ))}
          <div className="cfg-floor" style={{ '--glow': paint.hex }} />
        </div>
        <div className="swatches" data-reveal="up" data-delay="200">
          {paints.map((p) => (
            <button key={p.id} className={p.id === paint.id ? 'on' : ''} onClick={() => setPaint(p)} aria-label={p.name}>
              <i style={{ background: p.hex }} /><span>{p.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="spec-band">
        {specs.map(([k, v], i) => (
          <div key={k} data-reveal="up" data-delay={i * 70}><span>{k}</span><strong>{v}</strong></div>
        ))}
      </section>

      <section className="trims">
        <div className="trims-head" data-reveal="up"><Kicker red>Three ways to own it</Kicker><h2>CHOOSE YOUR <b>CHARACTER</b></h2></div>
        <div className="trim-row">
          {trims.map((t, i) => (
            <article key={t.n} data-reveal="up" data-delay={i * 120}>
              <span className="num">0{i + 1}</span>
              <h3>{t.n}</h3>
              <p>{t.d}</p>
              <footer><b>{t.p}</b><a href="#/contact">Reserve <ArrowRight size={14} /></a></footer>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

/* ========================================================= PERFORMANCE ==== */
/* Telemetry board: huge counters, acceleration bars, power curve, lap board. */
const accel = [['0–100 km/h', 3.1, 12], ['0–200 km/h', 7.4, 12], ['0–300 km/h', 18.9, 22], ['100–0 km/h', 2.9, 12]]
const laps = [
  ['Nürburgring Nordschleife', '6:58.2'], ['Fiorano', '1:08.7'], ['Mugello', '1:49.1'], ['Monza', '1:42.3'], ['Spa-Francorchamps', '2:21.6'],
]
// power (cv) and torque (Nm) every 1000 rpm, 1000–8000
const power = [110, 230, 360, 480, 600, 710, 800, 820]
const torque = [520, 760, 880, 900, 900, 870, 790, 700]

function curve(vals, max, w = 600, h = 240) {
  return vals.map((v, i) => `${i ? 'L' : 'M'}${(i / (vals.length - 1)) * w},${h - (v / max) * h}`).join(' ')
}

export function PerformancePage() {
  return (
    <div className="pg pg-perf">
      <section className="tele">
        <div className="tele-bg" data-parallax="0.2" />
        <div className="tele-copy">
          <Kicker red>Telemetry</Kicker>
          <h1 data-reveal="clip">ZERO TO 100<br />IN <em><span data-count="3.1">3.1</span>s</em></h1>
          <p data-reveal="up" data-delay="200">A 3.9-litre V8 and three electric motors deliver 820 cv through an e-AWD system that thinks 200 times a second.</p>
        </div>
        <div className="dial" data-reveal="zoom" data-delay="250">
          <svg viewBox="0 0 200 200">
            <circle className="track" cx="100" cy="100" r="86" />
            <circle className="fill" cx="100" cy="100" r="86" pathLength="100" />
          </svg>
          <div><strong data-count="350">350</strong><span>km/h top speed</span></div>
        </div>
      </section>

      <section className="accel">
        <Kicker red>Acceleration</Kicker>
        {accel.map(([k, v, max], i) => (
          <div key={k} className="bar" data-reveal="bar" data-delay={i * 120} style={{ '--w': `${(v / max) * 100}%` }}>
            <span>{k}</span><i /><strong><span data-count={v}>{v}</span> s</strong>
          </div>
        ))}
      </section>

      <section className="curves">
        <div data-reveal="up">
          <Kicker red>Power delivery</Kicker>
          <h2>A CURVE WITH<br /><b>NO FLAT SPOTS</b></h2>
          <ul className="legend"><li><i className="r" />Power · 820 cv</li><li><i className="g" />Torque · 900 Nm</li></ul>
        </div>
        <svg className="chart" viewBox="-30 -10 660 290" data-reveal="draw">
          {[0, 1, 2, 3, 4].map((i) => <line key={i} x1="0" x2="600" y1={i * 60} y2={i * 60} />)}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((r, i) => <text key={r} x={(i / 7) * 600} y="270">{r}k</text>)}
          <path className="pw" d={curve(power, 950)} pathLength="1" />
          <path className="tq" d={curve(torque, 950)} pathLength="1" />
        </svg>
      </section>

      <section className="laps">
        <div className="laps-img" data-reveal="clip"><img src="/img/p4.jpg" alt="" /></div>
        <div className="board">
          <Kicker red>Lap board</Kicker>
          {laps.map(([t, v], i) => (
            <div key={t} data-reveal="left" data-delay={i * 90}><span>{String(i + 1).padStart(2, '0')}</span><b>{t}</b><strong>{v}</strong></div>
          ))}
        </div>
      </section>
    </div>
  )
}

/* ========================================================== TECHNOLOGY ==== */
/* Interactive hotspots on the car + tabbed deep dives. */
const spots = [
  { id: 'aero', x: 8, y: 62, t: 'Active front aero', d: 'Flaps in the bumper open in 0.3 s to balance downforce between axles.' },
  { id: 'light', x: 26, y: 50, t: 'Matrix LED', d: '84-segment headlights shape the beam around oncoming traffic.' },
  { id: 'brake', x: 47, y: 74, t: 'CCM-R brakes', d: 'Formula-derived carbon ceramics: 398 mm discs, 6-piston callipers.' },
  { id: 'cabin', x: 58, y: 28, t: 'Carbon cell', d: 'One-piece monocoque weighing 82 kg with 40 % more torsional stiffness.' },
  { id: 'rear', x: 88, y: 46, t: 'Shut-off Gurney', d: 'Rear spoiler shuts off in high-speed mode for a 6 % drag reduction.' },
]
const tabs = [
  { k: 'Aerodynamics', img: '/img/g2.jpg', h: 'AIR, SCULPTED', p: 'Vortex generators under the nose and a two-position rear wing produce 390 kg of downforce at 250 km/h, without a fixed wing to break the silhouette.' },
  { k: 'Chassis', img: '/img/g4.jpg', h: 'STIFF WHERE IT MATTERS', p: 'A carbon tub, aluminium subframes and magnetorheological dampers read the road 1,000 times per second.' },
  { k: 'Powertrain', img: '/img/p3.jpg', h: 'V8 + THREE MOTORS', p: 'Two front motors give torque vectoring, a third sits between engine and an 8-speed dual-clutch gearbox.' },
  { k: 'Cockpit', img: '/img/interior.jpg', h: 'EYES UP, HANDS ON', p: 'A curved 16" HMI, haptic steering-wheel controls and a head-up display keep every input at your fingertips.' },
]

export function TechnologyPage() {
  const [spot, setSpot] = useState(spots[3])
  const [tab, setTab] = useState(0)
  return (
    <div className="pg pg-tech">
      <section className="spots">
        <div className="spots-head" data-reveal="up"><Kicker red>Inside the engineering</Kicker><h1>TOUCH THE <b>DETAILS</b></h1></div>
        <div className="spot-stage" data-reveal="zoom">
          <img src="/img/car-side.png" alt="IL CORSA" />
          {spots.map((s) => (
            <button key={s.id} className={`pin${spot.id === s.id ? ' on' : ''}`} style={{ left: `${s.x}%`, top: `${s.y}%` }} onClick={() => setSpot(s)} aria-label={s.t}><i /></button>
          ))}
        </div>
        <div className="spot-card" key={spot.id}>
          <span>{String(spots.indexOf(spot) + 1).padStart(2, '0')} / 05</span>
          <h3>{spot.t}</h3><p>{spot.d}</p>
        </div>
      </section>

      <section className="tabs">
        <div className="tab-list" data-reveal="up">
          {tabs.map((t, i) => <button key={t.k} className={i === tab ? 'on' : ''} onClick={() => setTab(i)}>{String(i + 1).padStart(2, '0')}<span>{t.k}</span></button>)}
        </div>
        <div className="tab-body" key={tab}>
          <img src={tabs[tab].img} alt="" />
          <div><h2>{tabs[tab].h}</h2><p>{tabs[tab].p}</p></div>
        </div>
        <img className="tab-wire" src="/img/wireframe.png" alt="" aria-hidden="true" data-parallax="0.1" />
      </section>
    </div>
  )
}

/* ============================================================= GALLERY ==== */
/* Filterable masonry archive with a keyboard-friendly lightbox. */
const shots = [
  { src: '/img/p1.jpg', c: 'Exterior', t: 'Ginza, Tokyo' },
  { src: '/img/p6.jpg', c: 'Interior', t: 'Bordeaux leather' },
  { src: '/img/p2.jpg', c: 'Exterior', t: 'Atelier, Modena' },
  { src: '/img/g4.jpg', c: 'Detail', t: 'Forged wheel' },
  { src: '/img/p3.jpg', c: 'Exterior', t: 'Salon debut' },
  { src: '/img/g2.jpg', c: 'Detail', t: 'Light signature' },
  { src: '/img/p5.jpg', c: 'Interior', t: 'Spider cockpit' },
  { src: '/img/p4.jpg', c: 'Exterior', t: 'Delivery day' },
  { src: '/img/p7.jpg', c: 'Detail', t: 'Side intake' },
  { src: '/img/g1.jpg', c: 'Exterior', t: 'Studio' },
]

export function GalleryPage() {
  const [cat, setCat] = useState('All')
  const [open, setOpen] = useState(-1)
  const list = shots.filter((s) => cat === 'All' || s.c === cat)
  useEffect(() => {
    if (open < 0) return
    const k = (e) => {
      if (e.key === 'Escape') setOpen(-1)
      if (e.key === 'ArrowRight') setOpen((o) => (o + 1) % list.length)
      if (e.key === 'ArrowLeft') setOpen((o) => (o - 1 + list.length) % list.length)
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open, list.length])
  return (
    <div className="pg pg-gallery">
      <section className="archive-head">
        <h1 data-reveal="clip">THE <b>ARCHIVE</b></h1>
        <div className="chips" data-reveal="up" data-delay="150">
          {['All', 'Exterior', 'Interior', 'Detail'].map((c) => <button key={c} className={c === cat ? 'on' : ''} onClick={() => setCat(c)}>{c}</button>)}
        </div>
      </section>
      <section className="masonry" key={cat}>
        {list.map((s, i) => (
          <figure key={s.src} className="in-anim" style={{ animationDelay: `${i * 60}ms` }} onClick={() => setOpen(i)}>
            <img src={s.src} alt={s.t} loading="lazy" />
            <figcaption><span>{s.c}</span>{s.t}</figcaption>
          </figure>
        ))}
      </section>
      {open >= 0 && (
        <div className="lightbox" onClick={() => setOpen(-1)}>
          <button className="lb-x" aria-label="Close"><X /></button>
          <button className="lb-prev" aria-label="Previous" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + list.length) % list.length) }}><ChevronLeft /></button>
          <figure onClick={(e) => e.stopPropagation()} key={open}>
            <img src={list[open].src} alt={list[open].t} />
            <figcaption>{list[open].t} · {open + 1} / {list.length}</figcaption>
          </figure>
          <button className="lb-next" aria-label="Next" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % list.length) }}><ChevronRight /></button>
        </div>
      )}
    </div>
  )
}
