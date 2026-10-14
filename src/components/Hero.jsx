import { Info, Infinity as InfinityIcon, Sparkles } from 'lucide-react'
import { categories, hotspots, model } from '../data'
import Car from './Car'
import Star from './Star'

export default function Hero({ category, onCategory, color }) {
  return (
    <section className="hero">
      <div className="hero-left">
        <div className="title-row">
          <h1>{model.make}</h1>
          <button className="icon-btn" aria-label="About this model"><Info size={18} /></button>
        </div>
        <p className="subtitle">{model.name} - {model.year}</p>

        <div className="categories" role="tablist" aria-label="Feature category">
          {categories.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={category === c}
              className={`pill category ${category === c ? 'is-active' : ''}`}
              onClick={() => onCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="stage">
        <Star className="stage-star" />
        <p className="note glass">{model.note}</p>

        <div className="car-wrap">
          <Car color={color.value} />
          {hotspots.map((h) => (
            <button
              key={h.id}
              className={`hotspot hotspot-${h.side}`}
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
            >
              <span className="hotspot-dot" />
              <span className="hotspot-label">{h.label}</span>
            </button>
          ))}
        </div>
      </div>

      <aside className="hero-right">
        <div className="power-card">
          <div className="power-head">
            <span className="icon-chip"><Sparkles size={16} /></span>
            {model.power.title}
          </div>
          <p className="power-body">{model.power.body}</p>
        </div>
        <a href="#" className="accessories">
          <InfinityIcon size={18} />
          {model.accessories}
        </a>
      </aside>
    </section>
  )
}
