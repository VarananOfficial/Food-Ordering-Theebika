'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { FoodCard } from '@/components/food-card'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { toast, Toaster } from 'sonner'
import {
  Star,
  Clock,
  Shield,
  Truck,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  ChefHat,
  Users,
  Heart,
  ArrowRight,
  Quote,
  LucideIcon,
  Leaf,
  Award,
  ShoppingBag,
  Utensils,
  Sparkles
} from 'lucide-react'
import { FC } from 'react'
import { motion } from 'framer-motion'

interface Food {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category?: string
  rating?: number
  prepTime?: string
}

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

interface Testimonial {
  name: string
  role: string
  content: string
  rating: number
  avatar: string
}

interface Stat {
  icon: LucideIcon
  value: string
  label: string
}

const Home: React.FC = () => {
  const { data: session, status } = useSession()
  const [foods, setFoods] = useState<Food[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { addToCart, getTotalItems } = useCart()

  useEffect(() => {
    fetchFoods()
  }, [])

  const fetchFoods = async (): Promise<void> => {
    try {
      setError(null)
      const response = await fetch('/api/foods')
      if (response.ok) {
        const data = await response.json()
        let foodsArray: Food[] = []
        
        if (Array.isArray(data)) {
          foodsArray = data
        } else if (data.foods && Array.isArray(data.foods)) {
          foodsArray = data.foods
        } else if (data.data && Array.isArray(data.data)) {
          foodsArray = data.data
        } else if (data.results && Array.isArray(data.results)) {
          foodsArray = data.results
        } else {
          console.error('Unexpected data structure:', data)
          setError('Unexpected data format from server')
          return
        }

        // Enhance food items with additional data for demo
        const enhancedFoods = foodsArray.map(food => ({
          ...food,
          category: ['Italian', 'Asian', 'Mediterranean', 'Desserts'][Math.floor(Math.random() * 4)],
          rating: Number((Math.random() * 1 + 4).toFixed(1)),
          prepTime: `${Math.floor(Math.random() * 20 + 10)}-${Math.floor(Math.random() * 20 + 30)} mins`
        }))

        setFoods(enhancedFoods)
      } else {
        const errorText = await response.text()
        setError(`Failed to fetch foods: ${response.status}`)
      }
    } catch (error: any) {
      setError(`Network error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (food: Food): void => {
    if (!session) {
      toast.error('Please sign in to add items to cart')
      return
    }
    addToCart(food)
    toast.success(`${food.name} added to cart!`)
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"
        ></motion.div>
      </div>
    )
  }

  const features: Feature[] = [
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "Fresh food delivered in 30 minutes or less"
    },
    {
      icon: Leaf,
      title: "Farm Fresh",
      description: "Locally sourced organic ingredients"
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Recognized for culinary excellence"
    },
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description: "Premium ingredients and expert preparation"
    }
  ]

  const testimonials: Testimonial[] = [
    {
      name: "Sarah Johnson",
      role: "Food Critic",
      content: "The best food delivery service I've ever used! Fresh ingredients, amazing flavors, and lightning-fast delivery.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      name: "Michael Chen",
      role: "Executive Chef",
      content: "As a professional chef, I'm impressed by the quality and presentation. It's like having a personal chef at home.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Emily Rodriguez",
      role: "Nutritionist",
      content: "Healthy, balanced meals that don't compromise on taste. My clients love the clean eating options.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "David Kumar",
      role: "Food Blogger",
      content: "GourmetEats has revolutionized my dining experience. Every meal feels like a celebration!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Lisa Thompson",
      role: "Wellness Coach",
      content: "Perfect for my busy lifestyle. Nutritious, delicious meals delivered right to my door.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "James Wilson",
      role: "Restaurant Owner",
      content: "The attention to detail and flavor profiles are exceptional. Truly restaurant-quality meals.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face"
    }
  ]

  const stats: Stat[] = [
    { icon: Users, value: "50K+", label: "Satisfied Customers" },
    { icon: Utensils, value: "200+", label: "Gourmet Dishes" },
    { icon: Star, value: "4.9", label: "Average Rating" },
    { icon: ShoppingBag, value: "98%", label: "Repeat Orders" }
  ]

  return (
    <div className="bg-white antialiased">
      {/* <Navbar cartItemsCount={session ? getTotalItems() : 0} /> */}
      <Toaster position="top-center" richColors />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8 z-10"
            >
              {session ? (
                <>
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-medium shadow-sm">
                    <Heart className="w-4 h-4 mr-2" />
                    Welcome back, {session.user.name}!
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                    Your culinary journey <span className="text-amber-600">continues</span>
                  </h1>
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-lg">
                    Discover chef-curated meals crafted with seasonal ingredients, delivered to your door at the perfect temperature.
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-medium shadow-sm">
                    ✨ Michelin-inspired Cuisine
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                    Restaurant quality <span className="text-gradient bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">meals at home</span>
                  </h1>
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-lg">
                    Experience the artistry of our award-winning chefs with meals prepared fresh daily using locally-sourced ingredients.
                  </p>
                </>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {!session ? (
                  <>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                      <Button size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl" asChild>
                        <Link href="/auth/signup">
                          Begin Your Experience <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                      <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-2 border-gray-300 hover:bg-gray-50 hover:border-amber-500 transition-all duration-300 rounded-xl" asChild>
                        <Link href="/auth/signin">Explore Menu</Link>
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl" asChild>
                      <Link href="#menu">
                        Order Now <ArrowRight className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl transform rotate-2 opacity-20 blur-lg"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80"
                    alt="Gourmet meal presentation"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full font-semibold text-amber-800 shadow-md flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>30 min delivery</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The <span className="text-amber-600">GourmetEats</span> Difference
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              What sets our culinary experience apart from the rest
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature: Feature, index: number) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-b from-amber-50 to-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat: Stat, index: number) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl mb-6 group">
                  <stat.icon className="w-8 h-8 text-amber-600 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2 font-serif">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-20 bg-white" id="menu">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-amber-600">Seasonal</span> Menu
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chef-curated dishes featuring the finest seasonal ingredients
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 shadow-sm max-w-2xl mx-auto">
              <div className="flex items-center justify-between">
                <p className="font-medium">Error: {error}</p>
                <Button onClick={fetchFoods} className="ml-4" size="sm" variant="outline">
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i: number) => (
                <div key={i} className="animate-pulse bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                  <div className="bg-gray-200 h-60"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded-lg mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Food Categories */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {['All', 'Italian', 'Asian', 'Mediterranean', 'Desserts'].map((category) => (
                  <Button
                    key={category}
                    variant="outline"
                    className="rounded-full px-6 py-2 border-amber-200 hover:bg-amber-50 text-gray-700 hover:text-amber-700 transition-colors"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Food Items Grid */}
              {foods.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {foods.map((food) => (
                    <motion.div 
                      key={food.id}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FoodCard
                        food={food}
                        onAddToCart={handleAddToCart}
                        // premiumTheme={true}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-amber-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <ChefHat className="w-12 h-12 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Our chefs are preparing something special</h3>
                  <p className="text-gray-500">New seasonal dishes coming soon</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Testimonials Section with Moving Animation */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dining <span className="text-amber-600">Testimonials</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from our discerning clientele about their experiences
            </p>
          </div>
          <div className="relative">
            {/* Moving testimonials container */}
            <motion.div 
              className="flex gap-8"
              animate={{ 
                x: [0, -100 * testimonials.length]
              }}
              transition={{ 
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ width: `${testimonials.length * 2 * 100}%` }}
            >
              {/* Duplicate testimonials for seamless loop */}
              {[...testimonials, ...testimonials].map((testimonial: Testimonial, index: number) => (
                <motion.div 
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 group border border-gray-100 flex-shrink-0"
                  style={{ width: '400px' }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-amber-100"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i: number) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < testimonial.rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-amber-200 opacity-70" />
                    <p className="text-gray-700 leading-relaxed pl-6 italic">
                      "{testimonial.content}"
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      

      {/* Compact Footer */}
      <footer className="bg-gradient-to-br from-amber-50 to-orange-50 text-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Info */}
            <div className="space-y-4">
              <div className="flex items-center">
                {/* <ChefHat className="w-8 h-8 text-amber-400 mr-2" /> */}
                <img
                    src="/logo.png"
                    alt="GourmetEats Logo"
                    className="w-8 h-8 mr-2 object-contain"
                  />
                
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">
                Elevating home dining with chef-crafted meals made from the finest seasonal ingredients.
              </p>
              <div className="flex space-x-3 pt-2">
                <a href="#" className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors duration-300">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors duration-300">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors duration-300">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Navigation</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-600 hover:text-amber-600 transition-colors duration-300 text-sm">Home</Link></li>
                <li><Link href="/menu" className="text-gray-600 hover:text-amber-600 transition-colors duration-300 text-sm">Our Menu</Link></li>
                <li><Link href="/about" className="text-gray-600 hover:text-amber-600 transition-colors duration-300 text-sm">Our Chefs</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-amber-600 transition-colors duration-300 text-sm">Contact Us</Link></li>
              </ul>
            </div>
            {/* Legal */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-600 hover:text-amber-600 transition-colors duration-300 text-sm">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-600 hover:text-amber-600 transition-colors duration-300 text-sm">Terms of Service</Link></li>
                <li><Link href="/faq" className="text-gray-600 hover:text-amber-600 transition-colors duration-300 text-sm">FAQ</Link></li>
              </ul>
            </div>
            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Contact Us</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-amber-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-600 text-sm"> Jaffna, Sri Lanka</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <p className="text-gray-600 text-sm">+94 76 123 4567</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <p className="text-gray-600 text-sm">hello@gourmeteats.lk</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-amber-200 mt-8 pt-6 text-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} GourmetEats. All rights reserved. Crafted with passion in Sri Lanka.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home;