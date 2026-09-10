import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/home/Hero'
import Categories from '../components/home/Categories'
import FeaturedItems from '../components/home/FeaturedItems'
import HowItWorks from '../components/home/HowItWorks'
import WhyRentLoop from '../components/home/WhyRentLoop'
import TrustSection from '../components/home/TrustSection'
import CTASection from '../components/home/CTASection'
import { demoCities } from '../data/filters'

function resolveCity(locationText = '') {
  return (
    demoCities.find((city) =>
      locationText.toLowerCase().includes(city.toLowerCase()),
    ) || ''
  )
}

export default function LandingPage() {
  const navigate = useNavigate()

  function handleSearch({ query, location }) {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    const city = resolveCity(location)
    if (city) params.set('city', city)
    const queryString = params.toString()
    navigate(queryString ? `/explore?${queryString}` : '/explore')
  }

  return (
    <div className="min-h-svh bg-sand">
      <Navbar />
      <main>
        <Hero onSearch={handleSearch} />
        <Categories />
        <FeaturedItems />
        <HowItWorks />
        <WhyRentLoop />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
