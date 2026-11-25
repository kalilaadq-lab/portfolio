import { Hero } from '../components/Hero'
import { Logos } from '../components/Logos'
import { Testimonials } from '../components/Testimonials'
import { Works } from '../components/Works'

export function Home() {
  return (
    <>
      <Hero />
      <Logos />
      <Works />
      <Testimonials />
    </>
  )
}
