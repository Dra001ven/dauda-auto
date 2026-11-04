import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, ArrowLeft, Search, MapPin, Info, RotateCcw } from 'lucide-react'
import Recolor from './Recolor'
import { cars, categories, naira, paints, leathers, finishes, OPTION_USD, findCar } from './stock'

const stat = (v, unit) => (v == null ? '—' : `${v.toLocaleString()}${unit}`)

function CarCard({ car, i = 0 }) {
  const v = car.views[0]
  return (
    <a className="car-card" href={`#/stock/${car.slug}`} style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }} data-tilt="5">
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
