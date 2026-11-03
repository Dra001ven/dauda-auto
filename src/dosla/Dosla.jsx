import { ArrowRight } from 'lucide-react'
import './dosla.css'

const nav = ['Home', 'Model', 'Performance', 'Technology', 'Gallery', 'Brand', 'Contact']

// Thin gold line icons drawn to match the reference's engraved style.
const I = {
  gauge: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M8 36a18 18 0 1 1 32 0" /><path d="M24 30l9-11" /><circle cx="24" cy="30" r="2.4" />
      {[-120, -90, -60, -30, 0, 30, 60, 90, 120].map((a) => {
        const r = (a - 90) * Math.PI / 180
        return <line key={a} x1={24 + 15 * Math.cos(r)} y1={27 + 15 * Math.sin(r)} x2={24 + 12 * Math.cos(r)} y2={27 + 12 * Math.sin(r)} />
      })}
      <path d="M14 42h20" />
    </svg>
  ),
  engine: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M10 18h6l3-4h10l3 4h5v6h3v-4h3v12h-3v-4h-3v8h-5l-3 4H17l-3-4h-4v-6H6v-6h4z" />
      <path d="M20 10h8M24 10v4" /><circle cx="24" cy="25" r="4" />
    </svg>
  ),
  track: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M8 40c-3-3 0-7 4-9l8-5c3-2 2-5 0-6l-3-2c-3-2-1-6 3-6h6c3 0 4 3 3 5l-2 3c-1 2 1 4 3 3l6-3c4-2 8 2 5 6l-4 4c-2 2-5 2-7 1l-3-1c-2-1-4 0-5 2l-4 6c-2 3-7 5-10 2z" />
    </svg>
  ),
  aero: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M3 15c4-6 14-6 18 0M6 15l-2 4M18 15l2 4M9 9l-1-4M15 9l1-4M12 8V4" /></svg>,
  chassis: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M4 16l3-7h10l3 7zM4 16h16M7 9l2-4h6l2 4M8 16v3M16 16v3" /></svg>,
  cockpit: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2" /><path d="M4 12h6M14 12h6M12 14v6" /></svg>,
  modes: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></svg>,
  play: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="12" r="10" /><path d="M10 8l6 4-6 4z" fill="currentColor" /></svg>,
}

const stats = [
  { icon: I.gauge, value: '3.1', unit: 's', label: '0-100 km/h' },
  { icon: I.engine, value: '820', unit: '', label: 'Horsepower' },
  { icon: I.gauge, value: '350', unit: 'km/h', label: 'Top speed' },
  { icon: I.track, value: '1:08.7', unit: '', label: 'Nurburgring lap' },
]

const tech = [
  [I.aero, 'Active aerodynamic system'],
  [I.chassis, 'Carbon monocoque chassis'],
  [I.cockpit, 'Race-inspired cockpit'],
  [I.modes, 'Next-gen drive modes'],
]

const quotes = [
  { q: ['IL CORSA is a masterpiece. The', 'attention to detail and driving', 'experience are unmatched.'], n: 'Alessandro R.', r: 'Collector, Monaco' },
  { q: ['A perfect blend of power, beauty,', 'and innovation. Rosso Milano', 'has redefined Italian excellence.'], n: 'James T.', r: 'Entrepreneur, London' },
  { q: ['Every drive feels personal.', 'IL CORSA is not just a car,', 'it’s an emotion.'], n: 'Matteo B.', r: 'Racing driver, Italy' },
]

function Brand() {
  return (
    <a className="brand" href="#home">
      <img src="/img/crest.png" alt="" />
      <span>ROSSO<small>MILANO</small></span>
    </a>
  )
}

export default function Rosso() {
  return (
    <div className="rm">
      <header className="nav">
        <Brand />
        <nav>{nav.map((l, i) => <a key={l} className={i === 0 ? 'on' : ''} href={`#${l.toLowerCase()}`}>{l}</a>)}</nav>
        <a className="btn-outline" href="#contact">Inquire now</a>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="eyebrow">Introducing <i /></p>
          <h1>BORN IN ITALY.<br /><em>CRAFTED TO</em><br /><b>INSPIRE.</b></h1>
          <p className="lead">Where Italian passion meets precision engineering.<br />A new era of performance begins.</p>
          <a className="btn" href="#model">Discover IL CORSA <ArrowRight /></a>
          <dl className="facts">
            <div><dt>Limited to</dt><dd>499 UNITS</dd></div>
            <div><dt>Handcrafted</dt><dd>IN MODENA</dd></div>
            <div><dt>Deliveries begin</dt><dd>Q4 2025</dd></div>
          </dl>
        </div>
        <img className="hero-car" src="/img/car-hero.png" alt="Red Italian supercar" />
        <img className="hero-reflect" src="/img/car-hero.png" alt="" aria-hidden="true" />
      </section>

      <section className="perf" id="performance">
        <p className="kicker"><span>PU</span>RE PERFORMANCE</p>
        <div className="perf-row">
          {stats.map(({ icon, value, unit, label }) => (
            <div key={label}>
              <span className="ico">{icon}</span>
              <p><strong>{value}<small>{unit}</small></strong><span>{label}</span></p>
            </div>
          ))}
        </div>
      </section>

      <section className="box model" id="model">
        <div className="curtain" />
        <img className="model-car" src="/img/car-side.png" alt="IL CORSA in profile" />
        <img className="model-reflect" src="/img/car-side.png" alt="" aria-hidden="true" />
        <div className="model-copy">
          <p className="kicker red">THE DEBUT MODEL <i /></p>
          <h2>IL CORSA</h2>
          <p className="sub">Designed without compromise.</p>
          <p className="body">IL CORSA is more than a supercar—<br />it’s a statement of intent.<br />Every curve, every detail,<br />engineered to stir emotion.</p>
          <a className="btn" href="#technology">Explore model <ArrowRight /></a>
          <a className="film" href="#model">WATCH FILM {I.play}</a>
        </div>
      </section>

      <section className="box tech" id="technology">
        <img className="tech-img" src="/img/interior.jpg" alt="Red leather cockpit" />
        <div className="tech-copy">
          <p className="kicker red">TECHNOLOGY MEETS ARTISTRY</p>
          <h2>INTELLIGENCE<br />IN EVERY <b>DETAIL</b></h2>
          <p className="body">From advanced aerodynamics to a driver-focused cockpit,<br />IL CORSA delivers a connection like no other.</p>
          <ul>{tech.map(([icon, label]) => <li key={label}>{icon}{label}</li>)}</ul>
        </div>
        <img className="wire" src="/img/wireframe.png" alt="" aria-hidden="true" />
      </section>

      <section className="life" id="gallery">
        <p className="kicker red">BEYOND PERFORMANCE</p>
        <h2>A LIFESTYLE. A LEGACY.</h2>
        <div className="grid">{[1, 2, 3, 4, 5].map((g) => <img key={g} src={`/img/g${g}.jpg`} alt="" loading="lazy" />)}</div>
      </section>

      <section className="quotes" id="brand">
        <p className="kicker red">TRUSTED BY ENTHUSIASTS WORLDWIDE</p>
        <div className="q-row">
          {quotes.map((x) => (
            <blockquote key={x.n}>
              <p>{x.q.map((l) => <span key={l}>{l}<br /></span>)}</p>
              <footer><b>— {x.n}</b>{x.r}</footer>
            </blockquote>
          ))}
        </div>
        <img className="seal" src="/img/crest.png" alt="" aria-hidden="true" />
      </section>

      <section className="inquire" id="contact">
        <img className="duomo" src="/img/duomo-line.png" alt="" aria-hidden="true" />
        <div className="inq-copy">
          <p className="kicker red">OWN A PIECE OF ITALIAN EXCELLENCE</p>
          <h2>INQUIRE<br />ABOUT <b>IL CORSA</b></h2>
          <p className="body">Limited production. Bespoke experience.<br />Submit your inquiry and our concierge team<br />will connect with you.</p>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <input placeholder="First name" /><input placeholder="Last name" />
          <input placeholder="Email address" /><input placeholder="Phone number" />
          <input className="wide" placeholder="Country" />
          <textarea className="wide" placeholder="Message" />
          <button className="btn submit">Submit inquiry <ArrowRight /></button>
        </form>
      </section>

      <footer className="foot">
        <Brand />
        <div><h4>Company</h4><a href="#brand">About us</a><a href="#brand">Craftsmanship</a><a href="#brand">Careers</a><a href="#brand">News</a></div>
        <div><h4>Information</h4><a href="#contact">Ownership</a><a href="#contact">Warranty</a><a href="#contact">FAQ</a><a href="#contact">Privacy policy</a></div>
        <div><h4>Connect</h4><a href="#home">Instagram</a><a href="#home">YouTube</a><a href="#home">LinkedIn</a><a href="#contact">Contact</a></div>
        <div className="made"><p>HANDCRAFTED IN ITALY</p><i /><small>© 2025 ROSSO MILANO. ALL RIGHTS RESERVED.</small></div>
      </footer>
      <p className="credits">Photography: Wikimedia Commons contributors incl. Tokumeigakarinoaoshima, Francesca Milanini, pjhooker (CC BY-SA). Backgrounds removed / recoloured. Full list in docs/IMAGE-WORKFLOWS.md.</p>
    </div>
  )
}
