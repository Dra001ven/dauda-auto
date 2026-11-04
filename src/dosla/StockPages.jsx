import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, ArrowLeft, Search, MapPin, Info, RotateCcw } from 'lucide-react'
import Recolor from './Recolor'
import { cars, categories, naira, paints, leathers, finishes, OPTION_USD, findCar } from './stock'

const stat = (v, unit) => (v == null ? '—' : `${v.toLocaleString()}${unit}`)

function CarCard({ car, i = 0 }) {
  const v = car.views[0]
  return (
    <a className="car-card" href={`#/stock/${car.slug}`} style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}>
      <div className="cc-img"><img src={v.src} alt={`${car.make} ${car.model}`} loading="lazy" /></div>
      <div className="cc-body">
        <p className="cc-tags"><span>{car.cat}</span><span>{car.condition}</span></p>
        <small>{car.make}</small>
        <h3>{car.model}</h3>
        <dl>
          <div><dt>Power</dt><dd>{stat(car.hp, ' hp')}</dd></div>
          <div><dt>0–100</dt><dd>{stat(car.zero, ' s')}</dd></div>
          <div><dt>Top</dt><dd>{stat(car.top, ' km/h')}</dd></div>
        </dl>
        <footer><strong>{naira(car.usd)}</strong><em>Customise <ArrowRight size={14} /></em></footer>
      </div>
    </a>
  )
}

/* ================================================================ STOCK ==== */
const sorts = {
  featured: () => 0,
  'price-asc': (a, b) => (a.usd ?? 1e12) - (b.usd ?? 1e12),
  'price-desc': (a, b) => (b.usd ?? -1) - (a.usd ?? -1),
  power: (a, b) => (b.hp ?? 0) - (a.hp ?? 0),
}

export function StockPage() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const [sort, setSort] = useState('featured')
  const counts = useMemo(() => Object.fromEntries(categories.map((c) => [c, c === 'All' ? cars.length : cars.filter((x) => x.cat === c).length])), [])
  const list = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean)
    return cars
      .filter((c) => cat === 'All' || c.cat === cat)
      .filter((c) => words.every((w) => `${c.make} ${c.model} ${c.cat} ${c.colour} ${c.year} ${c.location}`.toLowerCase().includes(w)))
      .sort(sorts[sort])
  }, [q, cat, sort])

  return (
    <div className="pg pg-stock">
      <section className="stock-hero">
        <img className="sh-bg" src="/stock/lot-aerial.jpg" alt="" aria-hidden="true" data-parallax="0.12" />
        <div className="sh-copy">
          <p className="kicker" data-reveal="up">Lagos · Abuja · Delivered nationwide</p>
          <h1 data-reveal="clip">FIND YOUR <b>CAR</b></h1>
          <label className="search" data-reveal="up" data-delay="150">
            <Search size={18} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search make, model, colour… e.g. Ferrari, white, SUV" aria-label="Search the stock" />
            <span>{list.length} {list.length === 1 ? 'car' : 'cars'}</span>
          </label>
        </div>
      </section>

      <div className="stock-bar">
        <div className="chips">
          {categories.filter((c) => counts[c]).map((c) => (
            <button key={c} className={c === cat ? 'on' : ''} onClick={() => setCat(c)}>{c}<sup>{counts[c]}</sup></button>
          ))}
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="power">Most powerful</option>
        </select>
      </div>

      {(cat === 'All' || cat === 'Hypercar') && !q && (
        <section className="collection" data-reveal="zoom">
          <img src="/stock/hypercars.jpg" alt="Lamborghini Veneno, Bugatti Chiron, McLaren Senna, Ferrari LaFerrari, Zenvo TSR-S and a Koenigsegg parked together" loading="lazy" />
          <div><p className="kicker">Sourced on request</p><h2>THE <b>HYPERCAR</b> ROW</h2><p>Veneno, Chiron, Senna, LaFerrari, TSR-S. Tell us the car and we’ll find it, inspect it, ship it to Lagos and clear it.</p>
            <a className="btn" href="#/contact">Request a car <ArrowRight /></a></div>
        </section>
      )}

      <section className="stock-grid light" key={`${cat}-${sort}`}>
        {list.map((c, i) => <CarCard key={c.slug} car={c} i={i} />)}
        {!list.length && (
          <div className="empty">
            <h3>No cars match “{q}”</h3>
            <p>Try a make like <button onClick={() => setQ('Porsche')}>Porsche</button> or <button onClick={() => { setQ(''); setCat('All') }}>clear the filters</button>.</p>
          </div>
        )}
      </section>
    </div>
  )
}

/* ================================================================== CAR ==== */
function Swatches({ items, value, onPick, custom, onCustom }) {
  return (
    <div className="sw-row">
      {items.map((p) => (
        <button key={p.id} className={value === p.id ? 'on' : ''} onClick={() => onPick(p.id)} title={p.name} aria-label={p.name}>
          <i style={p.hex ? { background: p.hex } : undefined} className={p.hex ? '' : 'orig'}>{!p.hex && <RotateCcw size={13} />}</i>
        </button>
      ))}
      <label className={`sw-custom${value === 'custom' ? ' on' : ''}`} title="Any colour" style={{ '--c': custom }}>
        <i />
        <input type="color" value={custom} onChange={(e) => onCustom(e.target.value)} aria-label="Pick any colour" />
      </label>
    </div>
  )
}

export function CarPage({ slug }) {
  const car = findCar(slug)
  const [view, setView] = useState(0)
  const [paint, setPaint] = useState('orig')
  const [paintHex, setPaintHex] = useState('#3a7bd5')
  const [finish, setFinish] = useState('gloss')
  const [leather, setLeather] = useState('orig')
  const [leatherHex, setLeatherHex] = useState('#8a4a22')
  useEffect(() => { setView(0); setPaint('orig'); setFinish('gloss'); setLeather('orig') }, [slug])

  if (!car) {
    return <div className="pg pg-car"><section className="car-missing"><h2>That car isn’t in stock any more</h2><a className="btn" href="#/stock">Back to stock <ArrowRight /></a></section></div>
  }
  const v = car.views[view]
  const hasPaint = car.views.some((x) => x.kind === 'paint')
  const hasLeather = car.views.some((x) => x.kind === 'leather')
  const goto = (kind) => { if (v.kind !== kind) { const i = car.views.findIndex((x) => x.kind === kind); if (i >= 0) setView(i) } }
  const pObj = paints.find((p) => p.id === paint), lObj = leathers.find((p) => p.id === leather)
  const pHex = paint === 'custom' ? paintHex : pObj?.hex
  const lHex = leather === 'custom' ? leatherHex : lObj?.hex
  const fObj = finishes.find((f) => f.id === finish)

  const extras = [
    paint !== 'orig' && [`Paint: ${paint === 'custom' ? `Custom ${paintHex}` : pObj.name}`, OPTION_USD.paint],
    finish !== 'gloss' && [`${fObj.name} finish`, fObj.usd],
    leather !== 'orig' && [`Leather: ${leather === 'custom' ? `Custom ${leatherHex}` : lObj.name}`, OPTION_USD.leather],
  ].filter(Boolean)
  const total = car.usd == null ? null : car.usd + extras.reduce((s, [, u]) => s + u, 0)
  const related = cars.filter((c) => c.slug !== car.slug && (c.cat === car.cat || (c.usd && car.usd && Math.abs(c.usd - car.usd) / car.usd < 0.5))).slice(0, 3)

  return (
    <div className="pg pg-car">
      <nav className="crumbs"><a href="#/stock"><ArrowLeft size={14} /> Stock</a><span>/</span><span>{car.cat}</span><span>/</span><b>{car.make} {car.model}</b></nav>

      <section className="car-main">
        <div className="car-stage">
          <div className="stage-frame" key={v.src}>
            <Recolor src={v.src} mask={v.mask} color={v.kind === 'paint' ? pHex : v.kind === 'leather' ? lHex : null}
              finish={v.kind === 'paint' ? finish : 'gloss'} alt={`${car.make} ${car.model}, ${v.label}`} />
            <span className="stage-tag">{v.label}{v.kind && (v.kind === 'paint' ? (pHex || finish !== 'gloss' ? ' · customised' : '') : lHex ? ' · customised' : '')}</span>
          </div>
          {car.views.length > 1 && (
            <div className="thumbs">
              {car.views.map((x, i) => (
                <button key={x.src} className={i === view ? 'on' : ''} onClick={() => setView(i)}>
                  <img src={x.src} alt="" /><span>{x.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className="car-side">
          <small>{car.make} · {car.year}</small>
          <h1>{car.model}</h1>
          <p className="car-meta"><span>{car.condition}</span><span><MapPin size={13} /> {car.location}</span></p>
          <p className="car-blurb">{car.blurb}</p>

          {hasPaint && (
            <div className="opt">
              <h4>Exterior paint <em>{paint === 'custom' ? paintHex : pObj?.name}</em></h4>
              <Swatches items={paints} value={paint} onPick={(id) => { setPaint(id); goto('paint') }} custom={paintHex} onCustom={(h) => { setPaintHex(h); setPaint('custom'); goto('paint') }} />
              <div className="seg">
                {finishes.map((f) => <button key={f.id} className={finish === f.id ? 'on' : ''} onClick={() => { setFinish(f.id); goto('paint') }}>{f.name}</button>)}
              </div>
            </div>
          )}
          {hasLeather && (
            <div className="opt">
              <h4>Interior leather <em>{leather === 'custom' ? leatherHex : lObj?.name}</em></h4>
              <Swatches items={leathers} value={leather} onPick={(id) => { setLeather(id); goto('leather') }} custom={leatherHex} onCustom={(h) => { setLeatherHex(h); setLeather('custom'); goto('leather') }} />
            </div>
          )}

          {!hasPaint && !hasLeather && (
            <div className="opt"><h4>Customise</h4><p className="opt-note">This photo can’t be repainted online yet. Our Lagos studio can still do any paint, wrap or leather. Ask when you reserve.</p></div>
          )}

          <div className="build">
            <div><span>{car.usd == null ? 'Status' : 'Car'}</span><b>{car.usd == null ? 'Design render · not for sale' : naira(car.usd)}</b></div>
            {car.usd != null && extras.map(([k, u]) => <div key={k}><span>{k}</span><b>+ {naira(u)}</b></div>)}
            {total != null && <div className="total"><span>Your build (est.)</span><strong>{naira(total)}</strong></div>}
            <a className="btn" href="#/contact">{car.usd == null ? 'Commission something similar' : 'Reserve this build'} <ArrowRight /></a>
          </div>
        </aside>
      </section>

      {car.specs && (
        <section className="car-specs light">
          <div className="cs-head" data-reveal="up"><p className="kicker">Specification{car.specFor ? ` · shown for ${car.specFor}` : ''}</p><h2>THE <b>NUMBERS</b></h2></div>
          <div className="cs-grid">
            {[['0–100 km/h', stat(car.zero, ' s')], ['Top speed', stat(car.top, ' km/h')], ...Object.entries(car.specs)].map(([k, val], i) => (
              <div key={k} data-reveal="flip" data-delay={i * 60}><span>{k}</span><strong>{val}</strong></div>
            ))}
          </div>
        </section>
      )}

      <section className={`id-note${car.specs ? '' : ' light'}`} data-reveal="up">
        <Info size={18} />
        <div><h4>How we identified this car</h4><p>{car.idNote}</p></div>
      </section>

      {related.length > 0 && (
        <section className="related">
          <div className="cs-head" data-reveal="up"><p className="kicker">You may also like</p><h2>MORE <b>IN STOCK</b></h2></div>
          <div className="stock-grid">{related.map((c, i) => <CarCard key={c.slug} car={c} i={i} />)}</div>
        </section>
      )}
    </div>
  )
}
