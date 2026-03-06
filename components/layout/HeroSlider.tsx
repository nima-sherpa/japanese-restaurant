'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const slides = [
  { src: '/restaurant.webp', alt: 'Japanese Yama Sushi Restaurant' },
  { src: '/slide1.webp',     alt: 'Japanese Yama Sushi Food' },
  { src: '/slide2.webp',     alt: 'Japanese Yama Sushi Dishes' },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover"
            priority={i === 0}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="flex justify-center mb-6">
          <Image src="/logo.webp" alt="Japanese Yama Sushi Logo" width={120} height={120} className="object-contain drop-shadow-2xl" />
        </div>
        <p className="text-jp-gold text-lg tracking-[0.3em] mb-4 font-light">
          本格日本料理
        </p>
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4 leading-tight drop-shadow-lg">
          Japanese Yama Sushi
        </h1>
        <p className="text-xl text-gray-200 mb-10 font-light tracking-wide drop-shadow">
          Freshly Made Every Day — 6 Trinity St, London
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/menu"
            className="bg-jp-red text-white px-10 py-4 rounded-none font-semibold tracking-widest text-sm hover:bg-red-700 transition-colors uppercase">
            Order Now
          </Link>
          <Link href="/reservations"
            className="border-2 border-white text-white px-10 py-4 rounded-none font-semibold tracking-widest text-sm hover:bg-white hover:text-black transition-colors uppercase">
            Reserve a Table
          </Link>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-white w-6' : 'bg-white/50'}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white opacity-70 animate-bounce z-10">
        <div className="w-px h-8 bg-white mx-auto mb-1" />
        <p className="text-xs tracking-widest">SCROLL</p>
      </div>
    </section>
  )
}
