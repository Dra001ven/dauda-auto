import { useState } from 'react'
import { Logo } from './icons'
import { CarSwitcher, useShowroom, showroom } from './StockPages'
import { paints, finishes, naira } from './stock'
import { ArrowRight, MapPin, Clock, Phone, Check } from 'lucide-react'

/* Shared page banner: every page opens differently, but keeps the nav legible. */
function Kicker({ children, red }) {
  return <p className={`kicker${red ? ' red' : ''}`}>{children}</p>
}

/* =============================================================== MODEL ==== */
/* Showroom configurator: arrows switch between the real cars in stock, the name sits
   under the car, and the paint swatches repaint whichever car is showing. */
const NA = '—'
const sixSpecs = (c) => [
  ['Engine', c.specs?.Engine ?? NA], ['Power', c.specs?.Power ?? NA], ['Torque', c.specs?.Torque ?? NA],
  ['0–100 km/h', c.zero ? `${c.zero} s` : NA], ['Top speed', c.top ? `${c.top} km/h` : NA], ['Weight', c.specs?.Weight ?? NA],
]

export function ModelPage() {
  const sw = useShowroom()
  const { car } = sw
  const [paint, setPaint] = useState('orig')
  const [finish, setFinish] = useState('gloss')
  const p = paints.find((x) => x.id === paint)
  const canPaint = car.views.some((v) => v.kind === 'paint')
  return (
    <div className="pg pg-model">
      <section className="cfg" data-s3d>
        <h1 className="ghost" key={car.slug} data-parallax="-0.15">{car.model.replace(/\s*\(.*\)/, '').toUpperCase()}</h1>
        <div className="cfg-head" data-reveal="up">
          <Kicker red>Configure your</Kicker>
        </div>
        <CarSwitcher sw={sw} color={canPaint ? p.hex : null} finish={canPaint ? finish : 'gloss'}>
          <div className="cfg-links"><a href={`#/stock/${car.slug}`}>Full details <ArrowRight size={14} /></a><a href="#/technology">Technology <ArrowRight size={14} /></a></div>
        </CarSwitcher>
        <div className="swatches" data-reveal="up" data-delay="200">
          {canPaint ? paints.map((x) => (
            <button key={x.id} className={x.id === paint ? 'on' : ''} onClick={() => setPaint(x.id)} aria-label={x.name} title={x.name}>
              <i style={x.hex ? { background: x.hex } : undefined} className={x.hex ? '' : 'orig'} /><span>{x.id === 'orig' ? 'Original' : x.name}</span>
            </button>
          )) : <p className="cfg-note">This photo can’t be repainted online. Ask our Lagos studio for any paint or wrap.</p>}
        </div>
        {canPaint && (
          <div className="seg cfg-seg">
            {finishes.map((f) => <button key={f.id} className={finish === f.id ? 'on' : ''} onClick={() => setFinish(f.id)}>{f.name}</button>)}
          </div>
        )}
      </section>

      <section className="spec-band light" key={car.slug}>
        {sixSpecs(car).map(([k, v], i) => (
          <div key={k} className="rise" style={{ animationDelay: `${i * 70}ms` }}><span>{k}</span><strong>{v}</strong></div>
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

/* =============================================================== BRAND ==== */
/* Editorial: crest hero, alternating timeline, values, manifesto quote. */
const timeline = [
  ['2012', 'A forecourt in Lekki', 'Dauda Motos starts with three imported cars on a rented lot in Lekki Phase 1.'],
  ['2015', 'Tokunbo, done properly', 'Pre-shipment inspections begin: every foreign-used car is checked abroad before it is shipped to Lagos.'],
  ['2018', 'Abuja showroom', 'A second showroom opens in Wuse 2 for clients in the capital and the North.'],
  ['2022', 'The studio', 'An in-house paint, wrap and leather studio in Lagos: the customiser online, done for real.'],
  ['2026', 'Stock online', 'Search, customise and reserve any car in stock from your phone, priced in naira.'],
]
const values = [
  ['Verified', 'Every car is inspected, history-checked and road-tested before it reaches you.'],
  ['Transparent', 'One price in naira, including duty and clearing. No surprises on delivery day.'],
  ['Delivered', 'From the port to your gate, anywhere in Nigeria, with papers in order.'],
]

export function BrandPage() {
  return (
    <div className="pg pg-brand">
      <section className="manifest" data-s3d>
        <Logo className="m-crest" data-reveal="zoom" />
        <Kicker red>Since 2012 · Lagos</Kicker>
        <h1 data-reveal="up" data-delay="150">A HOUSE OF<br /><b>DRIVERS</b></h1>
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
        <blockquote>“We don’t just sell the fastest car.<br />We find the one you <b>remember</b>.”<cite>— Dauda Motos</cite></blockquote>
      </section>
    </div>
  )
}

/* ============================================================= CONTACT ==== */
/* Split screen: showroom finder + private-appointment booking with success state. */
const rooms = [
  // placeholder addresses and numbers: replace with the real ones
  { city: 'Lagos · Victoria Island', a: 'Adeola Odeku Street, Victoria Island', h: 'Mon–Sat · 09:00–18:00', t: '+234 800 000 0001' },
  { city: 'Lagos · Lekki', a: 'Admiralty Way, Lekki Phase 1', h: 'Mon–Sat · 09:00–18:00', t: '+234 800 000 0002' },
  { city: 'Abuja', a: 'Aminu Kano Crescent, Wuse 2', h: 'Mon–Sat · 09:00–18:00', t: '+234 800 000 0003' },
  { city: 'Port Harcourt', a: 'Aba Road, GRA Phase 2', h: 'Mon–Fri · 09:00–17:00', t: '+234 800 000 0004' },
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
              <h2>THANK YOU.</h2>
              <p>Your {kind.toLowerCase()} request for {rooms[room].city} is with our concierge. Expect a call within 24 hours.</p>
              <button className="btn" onClick={() => setSent(false)}>New request <ArrowRight /></button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
              <Kicker>Private appointment · {rooms[room].city}</Kicker>
              <div className="kinds">
                {['Private viewing', 'Test drive', 'Custom build'].map((k) => (
                  <button type="button" key={k} className={k === kind ? 'on' : ''} onClick={() => setKind(k)}>{k}</button>
                ))}
              </div>
              <label>Full name<input required placeholder="Adaeze Okafor" /></label>
              <label>Email<input required type="email" placeholder="you@domain.com" /></label>
              <div className="row">
                <label>Preferred date<input required type="date" /></label>
                <label>Time<select defaultValue="11:00">{['10:00', '11:00', '14:00', '16:00', '18:00'].map((t) => <option key={t}>{t}</option>)}</select></label>
              </div>
              <label>Notes<textarea rows="3" placeholder="Car, paint, delivery state…" /></label>
              <button className="btn">Request appointment <ArrowRight /></button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
