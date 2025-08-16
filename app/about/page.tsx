import React from 'react'
import Image from 'next/image'
import image1 from '../public/img1.jpg'
import image2 from '../public/img2.jpg'
import image3 from '../public/img3.jpg'
import { FaAward, FaLeaf, FaWineGlassAlt, FaUtensils } from 'react-icons/fa'
import { Navbar } from '@/components/navbar'

const AboutPage = () => {
  return (
    <div className="bg-white">
      <Navbar selected="About" cartItemsCount={3} />
      {/* Banner Image Section */}
      <section className="relative h-96 w-full">
        <Image 
          src={image1} 
          alt="Elegant restaurant dining area"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center px-4">
            <span className="block text-amber-400 font-serif mb-2">Since 1973</span>
            A Tradition of Culinary Excellence
          </h1>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-6">
              Our 50-Year Journey
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              What began as a small family trattoria in Florence has blossomed into an internationally acclaimed dining destination. Through three generations, we've maintained our commitment to authentic flavors while embracing culinary innovation.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Today, we continue to honor our founder's vision while setting new standards in gastronomic excellence.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-400">
                <h3 className="font-bold text-gray-800 text-xl">50+</h3>
                <p className="text-gray-600">Years of Excellence</p>
              </div>
              <div className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-400">
                <h3 className="font-bold text-gray-800 text-xl">150+</h3>
                <p className="text-gray-600">Awards Worldwide</p>
              </div>
            </div>
          </div>
          <div className="relative h-96 rounded-xl overflow-hidden shadow-xl">
            <Image 
              src={image2}
              alt="Our restaurant in 1970s"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-gray-800 mb-16">
            Our Culinary Philosophy
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <FaLeaf className="text-3xl text-amber-600" />,
                title: "Seasonal Ingredients",
                desc: "We source only the freshest seasonal produce from local farmers"
              },
              {
                icon: <FaUtensils className="text-3xl text-amber-600" />,
                title: "Traditional Techniques",
                desc: "Preserving century-old cooking methods with modern precision"
              },
              {
                icon: <FaAward className="text-3xl text-amber-600" />,
                title: "Excellence",
                desc: "Every dish meets our uncompromising standards of perfection"
              },
              {
                icon: <FaWineGlassAlt className="text-3xl text-amber-600" />,
                title: "Pairing Mastery",
                desc: "Our sommeliers craft perfect wine accompaniments"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chef Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-96 rounded-xl overflow-hidden shadow-xl order-last md:order-first">
            <Image 
              src={image3} 
              alt="Our head chef"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-6">
              Meet Our Master Chef
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Chef Giovanni Moretti, third-generation master of our kitchen, brings both reverence for tradition and passion for innovation to every creation.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Trained in Michelin-starred restaurants across Europe before returning to his family's legacy, Chef Giovanni has been awarded "Chef of the Year" three times by the International Culinary Association.
            </p>
            <button className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors">
              View Our Menu
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-4">
            Voices of Our Guests
          </h2>
          <p className="text-center text-gray-300 max-w-2xl mx-auto mb-12">
            Hear what our valued guests say about their experiences
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "The osso buco transported me straight to Milan. A perfect blend of tradition and innovation.",
                author: "Michelle R., Food Critic"
              },
              {
                quote: "Five generations of my family have celebrated special occasions here. Timeless excellence.",
                author: "Robert D., Regular Since 1982"
              },
              {
                quote: "The wine pairing elevated each course to new heights. An unforgettable evening.",
                author: "Sophia L., Connoisseur"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-800 p-8 rounded-xl">
                <div className="text-amber-400 text-4xl mb-4">"</div>
                <p className="text-lg italic mb-6">{testimonial.quote}</p>
                <p className="font-medium text-amber-400">{testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-gray-800 mb-12">
          Our Restaurant
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="relative h-48 md:h-64 rounded-xl overflow-hidden group">
              <Image
                src={`/gallery-${item}.jpg`}
                alt={`Restaurant gallery ${item}`}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AboutPage