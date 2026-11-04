import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useSmoothScroll, useScrollMotion, scrollTop } from './motion'
import { ModelPage, PerformancePage, TechnologyPage, GalleryPage, BrandPage, ContactPage } from './pages'
import { I } from './icons'
import DepthImage from './DepthImage'
import './dosla.css'
import './pages.css'

const routes = [
  ['Home', '/'], ['Model', '/model'], ['Performance', '/performance'], ['Technology', '/technology'],
  ['Gallery', '/gallery'], ['Brand', '/brand'], ['Contact', '/contact'],
]

const pages = {
  '/': Home, '/model': ModelPage, '/performance': PerformancePage, '/technology': TechnologyPage,
  '/gallery': GalleryPage, '/brand': BrandPage, '/contact': ContactPage,
}

function useRoute() {
  const read = () => (window.location.hash.replace(/^#/, '') || '/')
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const on = () => { setRoute(read()); scrollTop() }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return pages[route] ? route : '/'
}

function Brand() {
  return (
    <a className="brand" href="#/">
      <img src="/img/crest.png" alt="" />
      <span>DAUDA<small>MOTOS</small></span>
    </a>
  )
}

function Nav({ route }) {
  const [glass, setGlass] = useState(false)
  useEffect(() => {
    const on = () => setGlass(window.scrollY > 40)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [route])
  return (
    <header className={`nav${glass ? ' glass' : ''}`}>
      <Brand />
      <nav>{routes.map(([l, p]) => <a key={p} className={route === p ? 'on' : ''} href={`#${p}`}>{l}</a>)}</nav>
      <a className="btn-outline" href="#/contact">Inquire now</a>
    </header>
  )
}

function Footer() {
  return (
    <>
      <footer className="foot">
        <Brand />
        <div><h4>Company</h4><a href="#/brand">About us</a><a href="#/brand">Craftsmanship</a><a href="#/brand">Careers</a><a href="#/brand">News</a></div>
        <div><h4>Information</h4><a href="#/contact">Ownership</a><a href="#/contact">Warranty</a><a href="#/contact">FAQ</a><a href="#/contact">Privacy policy</a></div>
        <div><h4>Connect</h4><a href="#/">Instagram</a><a href="#/">YouTube</a><a href="#/">LinkedIn</a><a href="#/contact">Contact</a></div>
        <div className="made"><p>HANDCRAFTED IN ITALY</p><i /><small>© 2025 DAUDA MOTOS. ALL RIGHTS RESERVED.</small></div>
      </footer>
      <p className="credits">Photography: Calreyn88, Alexander Migl, pjhooker, Francesca Milanini, Tokumeigakarinoaoshima and other Wikimedia Commons contributors (CC BY-SA 3.0 / 4.0), crest lion by ImperialHerald (CC0). Backgrounds removed, some recoloured. Full list in docs/IMAGE-WORKFLOWS.md.</p>
    </>
  )
}

export default function DaudaMotos() {
  const route = useRoute()
  useSmoothScroll()
  useScrollMotion(route)
  const Page = pages[route]
  return (
    <div className="rm" key={route}>
      <Nav route={route} />
      <Page />
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
  { q: ['IL CORSA is a masterpiece. The', 'attention to detail and driving', 'experience are unmatched.'], n: 'Alessandro R.', r: 'Collector, Monaco' },
  { q: ['A perfect blend of power, beauty,', 'and innovation. Dauda Motos', 'has redefined Italian excellence.'], n: 'James T.', r: 'Entrepreneur, London' },
  { q: ['Every drive feels personal.', 'IL CORSA is not just a car,', 'it’s an emotion.'], n: 'Matteo B.', r: 'Racing driver, Italy' },
]

function Home() {
  return (
    <>
      <div className="scene scene-hero" data-pin><div className="scene-inner">
      <section className="hero intro">
        <div className="hero-bg"><DepthImage className="hero-bg-depth" src="/img/hero-bg.jpg" depth="/img/hero-bg-depth.jpg" strength={0.012} focus={0.3} drift={0.25} /></div>
        <div className="hero-copy">
          <p className="eyebrow">Introducing <i /></p>
          <h1>BORN IN ITALY.<br /><em>CRAFTED TO</em><br /><b>INSPIRE.</b></h1>
          <p className="lead">Where Italian passion meets precision engineering.<br />A new era of performance begins.</p>
          <a className="btn" href="#/model">Discover IL CORSA <ArrowRight /></a>
          <dl className="facts">
            <div><dt>Limited to</dt><dd>499 UNITS</dd></div>
            <div><dt>Handcrafted</dt><dd>IN MODENA</dd></div>
            <div><dt>Deliveries begin</dt><dd>Q4 2025</dd></div>
          </dl>
        </div>
        <DepthImage className="hero-car" src="/img/car-hero.png" depth="/img/car-hero-depth.png" alt="White Lamborghini Revuelto" strength={0.022} focus={0.6} />
        <img className="hero-reflect" src="/img/car-hero.png" alt="" aria-hidden="true" />
        <div className="hero-arc" aria-hidden="true" />
      </section>

      <section className="perf">
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

      <section className="box tech" data-s3d>
        <div className="tech-img-wrap" data-reveal="clip"><img className="tech-img" src="/img/interior.jpg" alt="Red leather cockpit" /></div>
        <div className="tech-copy" data-reveal="right" data-delay="150">
          <p className="kicker red">TECHNOLOGY MEETS ARTISTRY</p>
          <h2>INTELLIGENCE<br />IN EVERY <b>DETAIL</b></h2>
          <p className="body">From advanced aerodynamics to a driver-focused cockpit,<br />IL CORSA delivers a connection like no other.</p>
          <ul>{tech.map(([icon, label]) => <li key={label}>{icon}{label}</li>)}</ul>
        </div>
        <a href="#/technology"><img className="wire" src="/img/wireframe.png" alt="" aria-hidden="true" data-reveal="fade" data-delay="350" /></a>
      </section>

      <section className="life">
        <p className="kicker red" data-reveal="up">BEYOND PERFORMANCE</p>
        <h2 data-reveal="up" data-delay="80">A LIFESTYLE. A LEGACY.</h2>
        <div className="grid">{[1, 2, 3, 4, 5].map((g, i) => (
          <a key={g} href="#/gallery" data-reveal="up" data-delay={i * 110} data-tilt="8"><img src={`/img/g${g}.jpg`} alt="" loading="lazy" /><span className="cap"><b>{tiles[i][0]}</b>{tiles[i][1]}</span></a>
        ))}</div>
      </section>

      <section className="quotes">
        <p className="kicker red" data-reveal="up">TRUSTED BY ENTHUSIASTS WORLDWIDE</p>
        <div className="q-row">
          {quotes.map((x, i) => (
            <blockquote key={x.n} data-reveal="3d" data-delay={i * 120}>
              <p>{x.q.map((l) => <span key={l}>{l}<br /></span>)}</p>
              <footer><b>— {x.n}</b>{x.r}</footer>
            </blockquote>
          ))}
        </div>
        <img className="seal" src="/img/crest.png" alt="" aria-hidden="true" data-reveal="fade" data-delay="400" />
      </section>

      <section className="inquire" data-s3d>
        <img className="duomo" src="/img/duomo-line.png" alt="" aria-hidden="true" data-parallax="0.08" />
        <div className="inq-copy" data-reveal="up">
          <p className="kicker red">OWN A PIECE OF ITALIAN EXCELLENCE</p>
          <h2>INQUIRE<br />ABOUT <b>IL CORSA</b></h2>
          <p className="body">Limited production. Bespoke experience.<br />Submit your inquiry and our concierge team<br />will connect with you.</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); window.location.hash = '/contact' }} data-reveal="right" data-delay="150">
          <input placeholder="First name" /><input placeholder="Last name" />
          <input placeholder="Email address" /><input placeholder="Phone number" />
          <input className="wide" placeholder="Country" />
          <textarea className="wide" placeholder="Message" />
          <button className="btn submit">Submit inquiry <ArrowRight /></button>
        </form>
      </section>
    </>
  )
}
