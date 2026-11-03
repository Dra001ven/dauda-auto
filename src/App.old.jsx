import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import { colors } from './data'

export default function App() {
  const [nav, setNav] = useState('Models')
  const [category, setCategory] = useState('Design')
  const [color, setColor] = useState(colors.find((c) => c.id === 'copper'))

  return (
    <div className="page">
      <Header active={nav} onSelect={setNav} />
      <main>
        <Hero category={category} onCategory={setCategory} color={color} />
        <Features color={color} onColor={setColor} />
      </main>
    </div>
  )
}
