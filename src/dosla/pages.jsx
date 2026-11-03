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
