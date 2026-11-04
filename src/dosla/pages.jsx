import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowRight, ChevronLeft, ChevronRight, X, MapPin, Clock, Phone, Check } from 'lucide-react'

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
      <section className="cfg" data-s3d>
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

      <section className="spec-band light">
        {specs.map(([k, v], i) => (
          <div key={k} data-reveal="flip" data-delay={i * 90}><span>{k}</span><strong>{v}</strong></div>
        ))}
      </section>

      <section className="trims">
        <div className="trims-head" data-reveal="up"><Kicker red>Three ways to own it</Kicker><h2>CHOOSE YOUR <b>CHARACTER</b></h2></div>
        <div className="trim-row">
          {trims.map((t, i) => (
            <article key={t.n} data-reveal="3d" data-delay={i * 140} data-tilt="7">
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
      <section className="tele" data-s3d>
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

      <section className="accel light">
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

      <section className="laps light">
        <div className="laps-img" data-reveal="clip"><img src="/img/x-sto.jpg" alt="" /></div>
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
  { k: 'Aerodynamics', img: '/img/x-750s-nose.jpg', h: 'AIR, SCULPTED', p: 'Vortex generators under the nose and a two-position rear wing produce 390 kg of downforce at 250 km/h, without a fixed wing to break the silhouette.' },
  { k: 'Chassis', img: '/img/x-sto-wheel.jpg', h: 'STIFF WHERE IT MATTERS', p: 'A carbon tub, aluminium subframes and magnetorheological dampers read the road 1,000 times per second.' },
  { k: 'Powertrain', img: '/img/x-gt3rs.jpg', h: 'V8 + THREE MOTORS', p: 'Two front motors give torque vectoring, a third sits between engine and an 8-speed dual-clutch gearbox.' },
  { k: 'Cockpit', img: '/img/interior.jpg', h: 'EYES UP, HANDS ON', p: 'A curved 16" HMI, haptic steering-wheel controls and a head-up display keep every input at your fingertips.' },
]

export function TechnologyPage() {
  const [spot, setSpot] = useState(spots[3])
  const [tab, setTab] = useState(0)
  return (
    <div className="pg pg-tech">
      <section className="spots" data-s3d>
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

      <section className="tabs light">
        <div className="tab-list" data-reveal="up">
          {tabs.map((t, i) => <button key={t.k} className={i === tab ? 'on' : ''} onClick={() => setTab(i)}>{String(i + 1).padStart(2, '0')}<span>{t.k}</span></button>)}
        </div>
        <div className="tab-body" key={tab}>
          <img src={tabs[tab].img} alt="" />
          <div><h2>{tabs[tab].h}</h2><p>{tabs[tab].p}</p></div>
        </div>
        <img className="tab-wire" src="/img/wireframe-wine.png" alt="" aria-hidden="true" data-parallax="0.1" />
      </section>
    </div>
  )
}

/* ============================================================= GALLERY ==== */
/* Filterable masonry archive with a keyboard-friendly lightbox. */
const shots = [
  { src: '/img/x-sto.jpg', c: 'Exterior', t: 'Lamborghini Huracán STO' },
  { src: '/img/p6.jpg', c: 'Interior', t: 'Bordeaux leather' },
  { src: '/img/x-artura.jpg', c: 'Exterior', t: 'McLaren Artura' },
  { src: '/img/x-sto-wheel.jpg', c: 'Detail', t: 'Forged centre-lock' },
  { src: '/img/x-revuelto.jpg', c: 'Exterior', t: 'Lamborghini Revuelto' },
  { src: '/img/x-750s-nose.jpg', c: 'Detail', t: 'Eye-socket headlights' },
  { src: '/img/x-gt3rs.jpg', c: 'Exterior', t: 'Porsche 911 GT3 RS' },
  { src: '/img/p5.jpg', c: 'Interior', t: 'Spider cockpit' },
  { src: '/img/x-mc20.jpg', c: 'Exterior', t: 'Maserati MC20' },
  { src: '/img/x-750s.jpg', c: 'Exterior', t: 'McLaren 750S' },
  { src: '/img/g4.jpg', c: 'Detail', t: 'Five-spoke forged wheel' },
  { src: '/img/x-sto-blu.jpg', c: 'Exterior', t: 'Huracán STO, Blu Laufey' },
  { src: '/img/p1.jpg', c: 'Exterior', t: 'Ginza, Tokyo' },
  { src: '/img/x-750s-stand.jpg', c: 'Exterior', t: 'McLaren 750S, salon' },
  { src: '/img/g2.jpg', c: 'Detail', t: 'Bonnet scoop' },
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
      <section className="masonry light" key={cat}>
        {list.map((s, i) => (
          <figure key={s.src} className="in-anim" style={{ animationDelay: `${i * 70}ms` }} onClick={() => setOpen(i)} data-tilt="9">
            <img src={s.src} alt={s.t} loading="lazy" />
            <figcaption><span>{s.c}</span>{s.t}</figcaption>
          </figure>
        ))}
      </section>
      {open >= 0 && createPortal(
        <div className="lightbox" onClick={() => setOpen(-1)}>
          <button className="lb-x" aria-label="Close"><X /></button>
          <button className="lb-prev" aria-label="Previous" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + list.length) % list.length) }}><ChevronLeft /></button>
          <figure onClick={(e) => e.stopPropagation()} key={open}>
            <img src={list[open].src} alt={list[open].t} />
            <figcaption>{list[open].t} · {open + 1} / {list.length}</figcaption>
          </figure>
          <button className="lb-next" aria-label="Next" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % list.length) }}><ChevronRight /></button>
        </div>, document.body,
      )}
    </div>
  )
}

/* =============================================================== BRAND ==== */
/* Editorial: crest hero, alternating timeline, values, manifesto quote. */
const timeline = [
  ['1952', 'A workshop in Brera', 'Two brothers open a coachbuilding workshop behind the Pinacoteca, hand-beating aluminium bodies.'],
  ['1967', 'First victory', 'A Dauda Motos barchetta takes its class at the Targa Florio, beating factory teams.'],
  ['1988', 'Modena atelier', 'Production moves to Modena; every car is still signed by the craftsman who built its engine.'],
  ['2011', 'The electric turn', 'A hybrid racing programme begins, laying the groundwork for today’s e-AWD.'],
  ['2025', 'IL CORSA', '499 numbered cars. The most powerful road car the house has ever built.'],
]
const values = [
  ['Passione', 'We build for the person who will drive it, never for a spec sheet.'],
  ['Precisione', 'Tolerances measured in microns, stitches counted by hand: 1,800 per seat.'],
  ['Patrimonio', 'Seventy years of craft, carried forward one apprentice at a time.'],
]

export function BrandPage() {
  return (
    <div className="pg pg-brand">
      <section className="manifest" data-s3d>
        <img className="m-duomo" src="/img/duomo-white.png" alt="" aria-hidden="true" data-parallax="0.18" />
        <img className="m-crest" src="/img/crest-white.png" alt="Dauda Motos crest" data-reveal="zoom" />
        <Kicker red>Since 1952 · Milano</Kicker>
        <h1 data-reveal="up" data-delay="150">A HOUSE OF<br /><b>MAKERS</b></h1>
      </section>

      <section className="timeline light">
        {timeline.map(([y, h, p], i) => (
          <article key={y} className={i % 2 ? 'r' : 'l'} data-reveal={i % 2 ? 'right' : 'left'}>
            <span className="year">{y}</span><h3>{h}</h3><p>{p}</p>
          </article>
        ))}
      </section>

      <section className="values">
        {values.map(([h, p], i) => (
          <div key={h} data-reveal="3d" data-delay={i * 140} data-tilt="6"><span>0{i + 1}</span><h3>{h}</h3><p>{p}</p></div>
        ))}
      </section>

      <section className="quote-wide" data-reveal="clip" data-s3d>
        <img src="/img/x-revuelto.jpg" alt="" data-parallax="0.12" />
        <blockquote>“We do not build the fastest car.<br />We build the one you <b>remember</b>.”<cite>— Giulia Rossi, Design Director</cite></blockquote>
      </section>
    </div>
  )
}

/* ============================================================= CONTACT ==== */
/* Split screen: showroom finder + private-appointment booking with success state. */
const rooms = [
  { city: 'Milano', a: 'Via Montenapoleone 8', h: 'Mon–Sat · 10:00–19:00', t: '+39 02 7600 1952' },
  { city: 'Monaco', a: 'Avenue Princesse Grace 21', h: 'Mon–Sat · 10:00–19:00', t: '+377 93 30 1952' },
  { city: 'London', a: '14 Berkeley Square, Mayfair', h: 'Mon–Fri · 09:00–18:00', t: '+44 20 7499 1952' },
  { city: 'Dubai', a: 'Sheikh Zayed Road, DIFC', h: 'Sun–Thu · 10:00–20:00', t: '+971 4 330 1952' },
]

export function ContactPage() {
  const [room, setRoom] = useState(0)
  const [kind, setKind] = useState('Private viewing')
  const [sent, setSent] = useState(false)
  return (
    <div className="pg pg-contact">
      <section className="split">
        <div className="rooms light">
          <div data-reveal="up"><Kicker red>Showrooms</Kicker><h1>VISIT<br /><b>THE HOUSE</b></h1></div>
          <ul>
            {rooms.map((r, i) => (
              <li key={r.city} className={i === room ? 'on' : ''} onClick={() => setRoom(i)} data-reveal="3d" data-delay={i * 100}>
                <h3>{r.city}</h3>
                <p><MapPin size={13} />{r.a}</p><p><Clock size={13} />{r.h}</p><p><Phone size={13} />{r.t}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="book" data-reveal="right" data-delay="150">
          {sent ? (
            <div className="sent">
              <span><Check /></span>
              <h2>GRAZIE.</h2>
              <p>Your {kind.toLowerCase()} request for {rooms[room].city} is with our concierge. Expect a call within 24 hours.</p>
              <button className="btn" onClick={() => setSent(false)}>New request <ArrowRight /></button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
              <Kicker>Private appointment · {rooms[room].city}</Kicker>
              <div className="kinds">
                {['Private viewing', 'Test drive', 'Configuration'].map((k) => (
                  <button type="button" key={k} className={k === kind ? 'on' : ''} onClick={() => setKind(k)}>{k}</button>
                ))}
              </div>
              <label>Full name<input required placeholder="Alessandro Rossi" /></label>
              <label>Email<input required type="email" placeholder="you@domain.com" /></label>
              <div className="row">
                <label>Preferred date<input required type="date" /></label>
                <label>Time<select defaultValue="11:00">{['10:00', '11:00', '14:00', '16:00', '18:00'].map((t) => <option key={t}>{t}</option>)}</select></label>
              </div>
              <label>Notes<textarea rows="3" placeholder="Paint, interior, delivery country…" /></label>
              <button className="btn">Request appointment <ArrowRight /></button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
