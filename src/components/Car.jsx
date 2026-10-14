// Placeholder coupe in side profile. The body takes the selected paint colour,
// so the colour swatches work before real photography exists. Swap for an <img>
// of a transparent PNG once the real car shots are in public/.

function Wheel({ cx, cy }) {
  const spokes = Array.from({ length: 10 }, (_, i) => (i * 360) / 10)
  return (
    <g>
      <circle cx={cx} cy={cy} r="74" fill="#0d0d0d" />
      <circle cx={cx} cy={cy} r="56" fill="#1c1c1c" stroke="#3a3a3a" strokeWidth="3" />
      <rect x={cx - 34} y={cy - 46} width="22" height="36" rx="6" fill="#d9822b" transform={`rotate(-30 ${cx} ${cy})`} />
      {spokes.map((deg) => (
        <rect key={deg} x={cx - 3} y={cy - 54} width="6" height="44" rx="3" fill="#4a4a4a" transform={`rotate(${deg} ${cx} ${cy})`} />
      ))}
      <circle cx={cx} cy={cy} r="12" fill="#2b2b2b" stroke="#555" strokeWidth="2" />
    </g>
  )
}

export default function Car({ color }) {
  return (
    <svg className="car" viewBox="0 0 1000 420" role="img" aria-label="Car side profile">
      <defs>
        <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id="ground" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.35" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="510" cy="388" rx="470" ry="24" fill="url(#ground)" />

      {/* rear wing */}
      <path d="M40 168 L150 160 L152 172 L120 176 L112 206 L98 206 L104 178 L42 182 Z" fill="#1a1a1a" />

      {/* body */}
      <path
        className="car-body"
        d="M70 320 L60 262 Q62 222 104 210 L300 186 Q380 126 482 112 Q592 100 664 134 L744 178 Q864 188 932 212 Q968 228 970 272 L962 318 Q955 330 930 330 L880 330 A90 90 0 0 0 700 330 L340 330 A95 95 0 0 0 150 330 L95 330 Q72 328 70 320 Z"
        fill={color}
      />
      <path
        d="M70 320 L60 262 Q62 222 104 210 L300 186 Q380 126 482 112 Q592 100 664 134 L744 178 Q864 188 932 212 Q968 228 970 272 L962 318 Q955 330 930 330 L880 330 A90 90 0 0 0 700 330 L340 330 A95 95 0 0 0 150 330 L95 330 Q72 328 70 320 Z"
        fill="url(#shade)"
      />

      {/* glasshouse */}
      <path d="M318 188 Q392 138 484 126 Q566 118 626 136 L700 180 Z" fill="#141414" />
      <path d="M520 124 L512 182" stroke={color} strokeWidth="9" />

      {/* side skirt, door line, lights */}
      <path d="M340 326 L700 326 L690 308 L352 308 Z" fill="#111" opacity="0.8" />
      <path d="M512 186 L506 300" stroke="#000" strokeOpacity="0.25" strokeWidth="2" fill="none" />
      <path d="M560 236 L600 236" stroke="#000" strokeOpacity="0.35" strokeWidth="4" strokeLinecap="round" />
      <path d="M900 212 Q936 218 952 236 L912 232 Z" fill="#f4f4f4" />
      <path d="M64 236 L102 224 L104 240 L66 248 Z" fill="#8c1414" />
      <path d="M900 290 L966 286 L962 316 L910 318 Z" fill="#111" />

      <Wheel cx={245} cy={330} />
      <Wheel cx={790} cy={330} />
    </svg>
  )
}
