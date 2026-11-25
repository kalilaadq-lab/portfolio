import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Logos } from './components/Logos'
import { Nav } from './components/Nav'
import { StarField } from './components/StarField'
import { Testimonials } from './components/Testimonials'
import { ThemeToggle } from './components/ThemeToggle'
import { Works } from './components/Works'

export default function App() {
  return (
    <div className="relative">
      <StarField />
      <Nav />
      <div className="relative mx-auto max-w-[1440px]">
        <ThemeToggle />
      </div>
      <main className="relative">
        <Hero />
        <Logos />
        <Works />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}
