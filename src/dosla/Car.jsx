// Stylised side-profile car, drawn in SVG so the page needs no image files.
// Swap for real photography by replacing <Car /> with an <img>.
export default function Car({ body = '#1b1b1e', glow = true, flip = false, className = '' }) {
  return (
    <svg className={className} viewBox="0 0 600 220" style={flip ? { transform: 'scaleX(-1)' } : undefined} aria-hidden="true">
      <defs>
        <linearGradient id="cb" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a4a50" />
          <stop offset="0.35" stopColor={body} />
          <stop offset="1" stopColor="#050505" />
        </linearGradient>
        <linearGradient id="cg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0b0b0d" />
          <stop offset="1" stopColor="#2c2c32" />
        </linearGradient>
        <radialGradient id="cs" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.7" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="300" cy="190" rx="270" ry="14" fill="url(#cs)" />
      <path
        d="M30 150 C30 132 48 124 90 118 L190 104 C225 70 265 56 320 56 C385 56 425 76 455 102 L520 112 C560 118 575 130 575 150 L575 165 L30 165 Z"
        fill="url(#cb)"
      />
      <path d="M205 104 C235 76 268 68 318 68 C370 68 402 82 428 104 Z" fill="url(#cg)" />
      <path d="M322 70 L322 104" stroke="#000" strokeWidth="3" />
      <path d="M40 140 L560 140" stroke="var(--red)" strokeWidth="1.6" opacity={glow ? 0.9 : 0} />
      <rect x="548" y="124" width="26" height="6" rx="3" fill="#ffd9d6" />
      <rect x="30" y="126" width="16" height="6" rx="3" fill="var(--red)" />
      {[140, 470].map((x) => (
        <g key={x}>
          <circle cx={x} cy="160" r="38" fill="#050505" />
          <circle cx={x} cy="160" r="26" fill="#2a2a2e" />
          <circle cx={x} cy="160" r="9" fill="#0d0d0f" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <line key={a} x1={x} y1="160" x2={x + 24 * Math.cos((a * Math.PI) / 180)} y2={160 + 24 * Math.sin((a * Math.PI) / 180)} stroke="#555" strokeWidth="3" />
          ))}
        </g>
      ))}
    </svg>
  )
}
