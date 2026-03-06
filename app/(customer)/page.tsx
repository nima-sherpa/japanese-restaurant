import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home | Japanese Restaurant',
  description: 'Experience authentic Japanese cuisine',
}

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="hero-section py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Authentic Japanese Cuisine</h1>
          <p className="text-xl mb-8 opacity-90">
            Experience the finest flavors of Japan
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-jp-red text-jp-cream px-8 py-3 rounded-lg font-semibold hover:opacity-90">
              Order Now
            </button>
            <button className="border-2 border-jp-cream text-jp-cream px-8 py-3 rounded-lg font-semibold hover:bg-jp-cream hover:text-jp-black">
              Reserve Table
            </button>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured-section py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Featured Dishes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Featured items will be populated here */}
            <div className="text-center text-gray-500">
              Featured items loading...
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">About Us</h2>
          <p className="text-lg text-gray-600 mb-4">
            Welcome to our restaurant. We bring authentic Japanese culinary traditions to your table.
          </p>
        </div>
      </section>
    </div>
  )
}
