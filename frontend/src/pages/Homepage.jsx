// Homepage.jsx
import Features from '../components/features'
import FAQs from '../components/faq'
import Footer from './footer/footer'

export default function Homepage() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <main className="flex-grow">
        {/* Hero Section with Upload */}
        <section className="bg-transparent">
        </section>

        {/* Features Section */}
        <section className="bg-transparent">
          <Features />
        </section>

        {/* FAQ Section */}
        <section className="bg-transparent">
          <FAQs />
        </section>

      </main>

      <Footer />
    </div>
  )
}