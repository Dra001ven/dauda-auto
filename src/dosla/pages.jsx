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
