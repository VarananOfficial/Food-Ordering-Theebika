import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Navbar } from '@/components/navbar'

const ContactPage = () => {
  return (
    <div>
      <Navbar selected="Contact" cartItemsCount={3} />
       <section className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Heading */}
        <h1 className="text-4xl font-bold text-center text-orange-600 mb-10">
          Contact Our Restaurant
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Get in Touch</h2>
            <p className="text-gray-600">
              Have questions, feedback, or just want to book a table? We’d love to hear from you!
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="text-orange-500" />
                <span className="text-gray-700">
                  123 Flavor Street, Colombo, Sri Lanka
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-orange-500" />
                <span className="text-gray-700">+94 77 123 4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-orange-500" />
                <span className="text-gray-700">info@gourmeteats.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-orange-500" />
                <span className="text-gray-700">Mon-Sun: 10:00 AM - 11:00 PM</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Send Us a Message
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Message</label>
                <textarea
                  rows={4}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Your message..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Google Map Embed */}
        <div className="mt-12 rounded-2xl overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31688.890740645523!2d79.841849!3d6.927078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTUnMzcuNSJOIDc5wrA1MScwNS4xIkU!5e0!3m2!1sen!2slk!4v1615562358491!5m2!1sen!2slk"
            width="100%"
            height="400"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
    </div>
   
  );
};

export default ContactPage;
