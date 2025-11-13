import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import DescriptionSection from './components/DescriptionSection'
import TermSection from './components/TermSection'
import SignSection from './components/SignSection'
import ImageCarouselSection from './components/ImageCarouselSection'
import Footer from './components/Footer'
import Summary from './components/Summary'
import Login from './components/Login'

function HomePage() {
  return (
    <div className="app">
      <Header />
      <HeroSection />
      <DescriptionSection />
      <TermSection />
      <SignSection />
      <ImageCarouselSection />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </Router>
  )
}

export default App
