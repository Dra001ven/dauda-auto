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
