// Thin gold line icons drawn to match the reference's engraved style.
const tick = (a) => {
  const r = ((a - 90) * Math.PI) / 180
  return <line key={a} x1={24 + 15 * Math.cos(r)} y1={27 + 15 * Math.sin(r)} x2={24 + 12 * Math.cos(r)} y2={27 + 12 * Math.sin(r)} />
}

export const I = {
  gauge: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M8 36a18 18 0 1 1 32 0" /><path d="M24 30l9-11" /><circle cx="24" cy="30" r="2.4" />
      {[-120, -90, -60, -30, 0, 30, 60, 90, 120].map(tick)}
      <path d="M14 42h20" />
    </svg>
  ),
  engine: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M10 18h6l3-4h10l3 4h5v6h3v-4h3v12h-3v-4h-3v8h-5l-3 4H17l-3-4h-4v-6H6v-6h4z" />
      <path d="M20 10h8M24 10v4" /><circle cx="24" cy="25" r="4" />
    </svg>
  ),
  track: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M8 40c-3-3 0-7 4-9l8-5c3-2 2-5 0-6l-3-2c-3-2-1-6 3-6h6c3 0 4 3 3 5l-2 3c-1 2 1 4 3 3l6-3c4-2 8 2 5 6l-4 4c-2 2-5 2-7 1l-3-1c-2-1-4 0-5 2l-4 6c-2 3-7 5-10 2z" />
    </svg>
  ),
  aero: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M3 15c4-6 14-6 18 0M6 15l-2 4M18 15l2 4M9 9l-1-4M15 9l1-4M12 8V4" /></svg>,
  chassis: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M4 16l3-7h10l3 7zM4 16h16M7 9l2-4h6l2 4M8 16v3M16 16v3" /></svg>,
  cockpit: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2" /><path d="M4 12h6M14 12h6M12 14v6" /></svg>,
  modes: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></svg>,
  play: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="12" r="10" /><path d="M10 8l6 4-6 4z" fill="currentColor" /></svg>,
}
