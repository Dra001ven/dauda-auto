import { ArrowRight, Play, Zap, Gauge, Battery, Cog, Leaf, Search } from 'lucide-react'
import Car from './Car'
import './dosla.css'

const stats = [
  { icon: Zap, value: '620 km', label: 'Range (WLTP)' },
  { icon: Gauge, value: '3.2 s', label: '0–100 km/h' },
  { icon: Battery, value: '800 V', label: 'Ultra-fast charging' },
  { icon: Cog, value: 'AWD', label: 'Dual motor' },
  { icon: Leaf, value: 'Zero', label: 'Emissions' },
]

const models = [
  { name: 'DOSLA S', tag: 'Executive sedan', range: '620 km', accel: '3.2 s', drive: 'AWD', body: '#2a2a2e' },
  { name: 'DOSLA X', tag: 'Performance SUV', range: '580 km', accel: '3.8 s', drive: 'AWD', body: '#7a1410', flip: true },
  { name: 'DOSLA R', tag: 'Track-tuned coupe', range: '540 km', accel: '2.6 s', drive: 'AWD', body: '#1c1c20' },
]

const footer = {
  Models: ['DOSLA S', 'DOSLA X', 'DOSLA R'],
  Company: ['About', 'Sustainability', 'Careers', 'Press'],
  Support: ['Book a drive', 'Service', 'Charging', 'Contact'],
}

export default function Dosla() {
  return (
    <div className="dosla">
      <header className="nav">
        <a className="logo" href="#top">DOSLA</a>
        <nav>
          {['Models', 'Design', 'Technology', 'Stories'].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`}>{l}</a>
          ))}
        </nav>
        <div className="nav-right">
          <Search size={16} />
          <a className="btn btn-red btn-sm" href="#drive">Book a Drive</a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Electric · Intelligent · Human-centred</p>
          <h1>MOVE BEYOND <span>THE EXPECTED.</span></h1>
          <p className="lead">DOSLA creates performance electric vehicles that blend power, intelligent design and a deeply human way to drive.</p>
          <div className="hero-cta">
            <a className="btn btn-red" href="#models">Explore DOSLA <ArrowRight size={14} /></a>
            <a className="btn btn-ghost" href="#technology"><Play size={12} /> Watch the film</a>
          </div>
        </div>
        <Car className="hero-car" body="#222226" />
        <div className="hero-glow" />
      </section>

      <section className="stats">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label}>
            <Icon size={18} />
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="models" id="models">
        <div className="models-head">
          <p className="eyebrow dark">Our models</p>
          <h2>PURE FORM. <br />REAL FREEDOM.</h2>
          <p>Distinct personalities. A shared belief in a cleaner, more exciting way to move.</p>
          <a className="btn btn-black btn-sm" href="#models">View all models</a>
        </div>
        <div className="model-grid">
          {models.map((m) => (
            <article key={m.name} className="model-card">
              <Car body={m.body} flip={m.flip} glow={false} />
              <h3>{m.name}</h3>
              <small>{m.tag}</small>
              <dl>
                <div><dt>{m.range}</dt><dd>Range</dd></div>
                <div><dt>{m.accel}</dt><dd>0–100</dd></div>
                <div><dt>{m.drive}</dt><dd>Drive</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="tech" id="technology">
        <div className="tech-copy">
          <p className="eyebrow">Technology</p>
          <h2>INTELLIGENCE <br />DRIVES FURTHER.</h2>
          <p>From next-gen electric architecture to intelligent drive systems, DOSLA combines cutting-edge engineering with intuitive usability.</p>
          <a className="btn btn-red btn-sm" href="#technology">Explore technology <ArrowRight size={13} /></a>
        </div>
        <div className="tech-visual">
          <div className="engine">
            {Array.from({ length: 9 }).map((_, i) => <i key={i} style={{ '--i': i }} />)}
          </div>
          <ul>
            <li><b>High efficiency</b>Dual-motor drive unit</li>
            <li><b>Battery safety</b>Intelligent thermal control</li>
            <li><b>Advanced</b>Driver assistance</li>
          </ul>
        </div>
      </section>

      <section className="story" id="stories">
        <article className="story-card people">
          <p className="eyebrow">Our story</p>
          <h3>PEOPLE <br />DRIVE CHANGE.</h3>
          <p>We build more than cars. We build a cleaner, brighter tomorrow for people worth keeping.</p>
          <a href="#stories">Read our story <ArrowRight size={12} /></a>
        </article>
        <article className="story-card interior">
          <p className="eyebrow">Interior</p>
          <h3>A MORE <br />HUMAN DRIVE.</h3>
          <p>Calm. Connected. Crafted around you.</p>
          <a href="#stories">Explore the interior <ArrowRight size={12} /></a>
        </article>
      </section>

      <section className="cta" id="drive">
        <div>
          <p className="eyebrow">Book a test drive</p>
          <h2>Your next <br />chapter starts here.</h2>
          <p>Experience DOSLA for yourself. Book a test drive and feel the difference.</p>
          <a className="btn btn-white" href="#drive">Book a drive <ArrowRight size={14} /></a>
        </div>
        <Car className="cta-car" body="#1a1a1d" flip />
      </section>

      <footer className="foot">
        <div className="foot-brand">
          <a className="logo" href="#top">DOSLA</a>
          <p>Move beyond the expected.</p>
        </div>
        {Object.entries(footer).map(([h, items]) => (
          <div key={h}>
            <h4>{h}</h4>
            {items.map((i) => <a key={i} href="#top">{i}</a>)}
          </div>
        ))}
        <small>© 2026 DOSLA. All rights reserved.</small>
      </footer>
    </div>
  )
}
