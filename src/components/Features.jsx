import { useRef } from 'react'
import { Armchair, ArrowLeft, ArrowRight, Cog, Gauge, Info, Settings2, Timer, Zap } from 'lucide-react'
import { colors, specs } from '../data'

const icons = { seat: Armchair, engine: Cog, power: Zap, gearbox: Settings2, accel: Gauge, speed: Timer }

function SpecCard({ spec }) {
  const Icon = icons[spec.icon]
  return (
    <article className={`spec ${spec.kind ? `spec-${spec.kind}` : ''}`}>
      <div className="spec-top">
        <span className="icon-chip"><Icon size={16} /></span>
        {spec.title && <span className="spec-title">{spec.title}</span>}
        {spec.figure && spec.kind !== 'seats' && (
          <span className="spec-figure">{spec.figure}<small>{spec.unit}</small></span>
        )}
      </div>

      {spec.kind === 'seats' && (
        <div className="seat-photo">
          <span className="seat-count">{spec.figure}</span>
          <Armchair size={44} strokeWidth={1.2} />
        </div>
      )}

      {spec.kind === 'badge' ? (
        <div className="spec-badge">
          <strong>{spec.badge}</strong>
          <span>{spec.badgeSub}</span>
        </div>
      ) : (
        <div className="spec-bottom">
          {spec.label && <span className="spec-label">{spec.label}</span>}
          {spec.value && <span className="spec-value">{spec.value}</span>}
        </div>
      )}
    </article>
  )
}

export default function Features({ color, onColor }) {
  const track = useRef(null)
  const scroll = (dir) => track.current?.scrollBy({ left: dir * 280, behavior: 'smooth' })

  return (
    <section className="features">
      <div className="features-head">
        <div className="title-row">
          <h2>Feature Highlights</h2>
          <button className="icon-btn" aria-label="About features"><Info size={18} /></button>
        </div>

        <div className="colors">
          <span>Colors</span>
          {colors.map((c) => (
            <button
              key={c.id}
              className={`swatch ${color.id === c.id ? 'is-active' : ''}`}
              style={{ '--swatch': c.value }}
              aria-label={c.name}
              aria-pressed={color.id === c.id}
              onClick={() => onColor(c)}
            />
          ))}
        </div>
      </div>

      <div className="features-body">
        <div className="arrows">
          <button className="icon-btn" aria-label="Next" onClick={() => scroll(1)}><ArrowRight size={18} /></button>
          <button className="icon-btn" aria-label="Previous" onClick={() => scroll(-1)}><ArrowLeft size={18} /></button>
        </div>
        <div className="track" ref={track}>
          {specs.map((s) => <SpecCard key={s.id} spec={s} />)}
        </div>
      </div>
    </section>
  )
}
