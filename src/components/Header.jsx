import { Headphones, LayoutGrid, Menu, Search } from 'lucide-react'
import { navLinks } from '../data'

export default function Header({ active, onSelect }) {
  return (
    <header className="header">
      <a href="#" className="logo" aria-label="Dauda Motos home">
        <span className="logo-mark">Dauda.</span>
        <span className="logo-sub">Motos<br />Sell Center</span>
      </a>

      <div className="icon-group">
        <button className="icon-btn" aria-label="All models"><LayoutGrid size={18} /></button>
        <button className="icon-btn" aria-label="Search"><Search size={18} /></button>
      </div>

      <nav className="nav" aria-label="Main">
        {navLinks.map((link) => (
          <button
            key={link}
            className={`pill nav-pill ${active === link ? 'is-active' : ''}`}
            onClick={() => onSelect(link)}
          >
            {link}
          </button>
        ))}
      </nav>

      <div className="icon-group">
        <button className="icon-btn" aria-label="Support"><Headphones size={18} /></button>
        <button className="icon-btn" aria-label="Menu"><Menu size={18} /></button>
      </div>
    </header>
  )
}
