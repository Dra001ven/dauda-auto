// Faint three-pointed star watermark behind the car.
export default function Star({ className }) {
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="6" />
      <path
        d="M100 10 L112 96 L178 146 L100 112 L22 146 L88 96 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinejoin="round"
      />
    </svg>
  )
}
