import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useSmoothScroll, useScrollMotion, scrollTop } from './motion'
import { ModelPage, PerformancePage, TechnologyPage, BrandPage, ContactPage } from './pages'
import { StockPage, CarPage } from './StockPages'
import { Logo } from './icons'
import { I } from './icons'
import './dosla.css'
import './pages.css'
import './stock.css'

const routes = [
  ['Home', '/'], ['Model', '/model'], ['Performance', '/performance'], ['Technology', '/technology'],
  ['Stock', '/stock'], ['Brand', '/brand'], ['Contact', '/contact'],
]

const pages = {
  '/': Home, '/model': ModelPage, '/performance': PerformancePage, '/technology': TechnologyPage,
  '/stock': StockPage, '/brand': BrandPage, '/contact': ContactPage,
}

function useRoute() {
  // '#/stock/ferrari-f40?x' -> '/stock/ferrari-f40'; the old '#/gallery' link now opens the stock
  const read = () => { const r = (window.location.hash.replace(/^#/, '').split('?')[0] || '/').replace(/\/$/, '') || '/'; return r === '/gallery' ? '/stock' : r }
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const on = () => { setRoute(read()); scrollTop() }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return pages[route] || route.startsWith('/stock/') ? route : '/'
}

function Brand({ tone = 'white' }) {
  return (
    <a className="brand" href="#/">
      <Logo className={`logo logo-${tone}`} />
      <span>DAUDA<small>MOTOS</small></span>
    </a>
  )
}

function Nav({ route }) {
  const [glass, setGlass] = useState(false)
  useEffect(() => {
    const on = () => setGlass(route !== '/' || window.scrollY > 40)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [route])
  return (
    <header className={`nav${glass ? ' glass' : ''}`}>
      <Brand />
      <nav>{routes.map(([l, p]) => <a key={p} className={route === p || (p !== '/' && route.startsWith(p + '/')) ? 'on' : ''} href={`#${p}`}>{l}</a>)}</nav>
      <a className="btn-outline" href="#/contact">Inquire now</a>
    </header>
  )
}

// Muted looping clip (cut from the GT3 RS film in downloads/, see docs/IMAGE-WORKFLOWS.md).
// Plays only while on screen; reduced-motion users get the still poster.
function LoopVideo({ name, className }) {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { v.removeAttribute('autoplay'); v.pause(); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause() }, { threshold: 0.02 })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  return (
    <video ref={ref} className={className} autoPlay muted loop playsInline preload="auto" poster={`/video/${name}.jpg`} aria-hidden="true">
      <source src={`/video/${name}-720.mp4`} type="video/mp4" media="(max-width: 760px)" />
      <source src={`/video/${name}.webm`} type="video/webm" />
      <source src={`/video/${name}.mp4`} type="video/mp4" />
    </video>
  )
}

// Footer film: the driving shot (0:29.3–0:37.4 of the source).
function FooterFilm() {
  return (
    <section className="foot-film" data-s3d>
      <LoopVideo name="drive-gt3" />
      <div className="ff-copy" data-reveal="up">
        <p className="kicker">Lagos · Abuja · Delivered nationwide</p>
        <h2>DRIVE SOMETHING<br /><b>EXCEPTIONAL.</b></h2>
        <div className="ff-cta">
          <a className="btn" href="#/stock">Browse the stock <ArrowRight /></a>
          <a className="btn-outline" href="#/contact">Book a viewing</a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <>
      <FooterFilm />
      <footer className="foot light">
        <Brand tone="wine" />
        <div><h4>Company</h4><a href="#/brand">About us</a><a href="#/brand">Craftsmanship</a><a href="#/brand">Careers</a><a href="#/brand">News</a></div>
        <div><h4>Information</h4><a href="#/contact">Ownership</a><a href="#/contact">Warranty</a><a href="#/contact">FAQ</a><a href="#/contact">Privacy policy</a></div>
        <div><h4>Connect</h4><a href="#/">Instagram</a><a href="#/">YouTube</a><a href="#/">LinkedIn</a><a href="#/contact">Contact</a></div>
        <div className="made"><p>LAGOS · ABUJA · NIGERIA</p><i /><small>© 2026 DAUDA MOTOS. ALL RIGHTS RESERVED.</small></div>
      </footer>
      <p className="credits light">Photography: Calreyn88, Alexander Migl, pjhooker, Francesca Milanini, Tokumeigakarinoaoshima and other Wikimedia Commons contributors (CC BY-SA 3.0 / 4.0), crest lion by ImperialHerald (CC0). Backgrounds removed, some recoloured. Full list in docs/IMAGE-WORKFLOWS.md.</p>
    </>
  )
}

export default function DaudaMotos() {
  const route = useRoute()
  useSmoothScroll()
  useScrollMotion(route)
  const slug = route.startsWith('/stock/') ? route.slice(7) : null
  const Page = pages[route]
  return (
    <div className="rm" key={route}>
      <Nav route={route} />
      {slug ? <CarPage slug={slug} /> : <Page />}
      <Footer />
    </div>
  )
}

/* ------------------------------------------------------------------ home -- */

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

const tiles = [
  ['Night Run', 'Engineered for the dark.'], ['Sculpted Air', 'Every vent has a purpose.'], ['Grand Arrival', 'Presence, without a word.'],
  ['Forged Detail', 'Lighter, stronger, faster.'], ['City Legend', 'Born for the boulevard.'],
]

const quotes = [
  { q: ['They found the exact spec I wanted,', 'inspected it abroad and cleared it', 'at Tin Can. Zero stress.'], n: 'Tunde A.', r: 'Collector, Lagos' },
  { q: ['Transparent pricing in naira,', 'no surprises at delivery. Dauda Motos', 'is the standard in Abuja.'], n: 'Amina B.', r: 'Entrepreneur, Abuja' },
  { q: ['I changed the paint online,', 'and the car arrived exactly', 'like the picture.'], n: 'Chidi O.', r: 'Engineer, Port Harcourt' },
]

function Home() {
  return (
    <>
      <div className="scene scene-hero" data-pin><div className="scene-inner">
      <section className="hero intro">
        {/* hero film: 0:40–0:47.55 of the GT3 RS source (headlight, wing, profile) */}
        <div className="hero-bg"><LoopVideo name="hero-gt3" className="hero-video" /></div>
        <div className="hero-copy">
          <p className="eyebrow">Lagos · Abuja <i /></p>
          <h1>BORN IN LAGOS.<br /><em>CURATED TO</em><br /><b>INSPIRE.</b></h1>
          <p className="lead">Nigeria’s home for exceptional cars.<br />Verified, imported, cleared and delivered to your door.</p>
          <a className="btn" href="#/stock">Browse the stock <ArrowRight /></a>
          <dl className="facts">
            <div><dt>Showrooms</dt><dd>LAGOS · ABUJA</dd></div>
            <div><dt>Every car</dt><dd>INSPECTED</dd></div>
            <div><dt>Delivery</dt><dd>NATIONWIDE</dd></div>
          </dl>
        </div>
      </section>

      <section className="perf light">
        <p className="kicker"><span>PU</span>RE PERFORMANCE</p>
        <div className="perf-row">
          {stats.map(({ icon, value, unit, label }, i) => (
            <div key={label} data-reveal="up" data-delay={120 + i * 90}>
              <span className="ico">{icon}</span>
              <p><strong>{value.includes(':') ? value : <span data-count={value}>{value}</span>}<small>{unit}</small></strong><span>{label}</span></p>
            </div>
          ))}
        </div>
      </section>
      </div></div>

      <div className="scene scene-model" data-pin><div className="scene-inner">
      <section className="box model">
        <div className="curtain" />
        <img className="model-car" src="/img/car-side.png" alt="IL CORSA in profile" />
        <img className="model-reflect" src="/img/car-side.png" alt="" aria-hidden="true" />
        <div className="model-copy">
          <p className="kicker red">THE DEBUT MODEL <i /></p>
          <h2>IL CORSA</h2>
          <p className="sub">Designed without compromise.</p>
          <p className="body">IL CORSA is more than a supercar—<br />it’s a statement of intent.<br />Every curve, every detail,<br />engineered to stir emotion.</p>
          <a className="btn" href="#/model">Explore model <ArrowRight /></a>
          <a className="film" href="#/performance">WATCH FILM {I.play}</a>
        </div>
      </section>
      </div></div>

      <section className="box tech light" data-s3d>
        <div className="tech-img-wrap" data-reveal="clip"><img className="tech-img" src="/img/interior.jpg" alt="Red leather cockpit" /></div>
        <div className="tech-copy" data-reveal="right" data-delay="150">
          <p className="kicker red">TECHNOLOGY MEETS ARTISTRY</p>
          <h2>INTELLIGENCE<br />IN EVERY <b>DETAIL</b></h2>
          <p className="body">From advanced aerodynamics to a driver-focused cockpit,<br />IL CORSA delivers a connection like no other.</p>
          <ul>{tech.map(([icon, label]) => <li key={label}>{icon}{label}</li>)}</ul>
        </div>
        <a href="#/technology"><img className="wire" src="/img/wireframe-wine.png" alt="" aria-hidden="true" data-reveal="fade" data-delay="350" /></a>
      </section>

      <section className="life">
        <p className="kicker red" data-reveal="up">BEYOND PERFORMANCE</p>
        <h2 data-reveal="up" data-delay="80">A LIFESTYLE. A LEGACY.</h2>
        <div className="grid">{[1, 2, 3, 4, 5].map((g, i) => (
          <a key={g} href="#/stock" data-reveal="up" data-delay={i * 110} data-tilt="8"><img src={`/img/g${g}.jpg`} alt="" loading="lazy" /><span className="cap"><b>{tiles[i][0]}</b>{tiles[i][1]}</span></a>
        ))}</div>
      </section>

      <section className="quotes light">
        <p className="kicker red" data-reveal="up">TRUSTED BY DRIVERS ACROSS NIGERIA</p>
        <div className="q-row">
          {quotes.map((x, i) => (
            <blockquote key={x.n} data-reveal="3d" data-delay={i * 120}>
              <p>{x.q.map((l) => <span key={l}>{l}<br /></span>)}</p>
              <footer><b>— {x.n}</b>{x.r}</footer>
            </blockquote>
          ))}
        </div>
        <Logo className="seal" data-reveal="fade" data-delay="400" />
      </section>

      <section className="inquire" data-s3d>
        <div className="inq-copy" data-reveal="up">
          <p className="kicker red">OWN SOMETHING EXCEPTIONAL</p>
          <h2>INQUIRE<br />ABOUT <b>IL CORSA</b></h2>
          <p className="body">Limited production. Bespoke experience.<br />Submit your inquiry and our concierge team<br />will connect with you.</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); window.location.hash = '/contact' }} data-reveal="right" data-delay="150">
          <input placeholder="First name" /><input placeholder="Last name" />
          <input placeholder="Email address" /><input placeholder="Phone number" />
          <input className="wide" placeholder="State (e.g. Lagos)" />
          <textarea className="wide" placeholder="Message" />
          <button className="btn submit">Submit inquiry <ArrowRight /></button>
        </form>
      </section>
    </>
  )
}
