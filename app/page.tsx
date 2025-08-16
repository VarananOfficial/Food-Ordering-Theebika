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
import logo from '../app/public/logo1.png'

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
      <Navbar/>
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

      {/* Enhanced Features Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Animated Background Patterns */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-100/50 to-orange-100/50 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-tl from-orange-100/40 to-amber-100/40 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-r from-amber-200/30 to-orange-200/30 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Animated Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              The{" "}
              <motion.span 
                className="text-amber-600 relative inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.span
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{
                    background: "linear-gradient(90deg, #d97706, #ea580c, #d97706)",
                    backgroundSize: "200% 100%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}
                >
                  GourmetEats
                </motion.span>
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  viewport={{ once: true }}
                />
              </motion.span>{" "}
              Difference
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              What sets our culinary experience apart from the rest
            </motion.p>
          </motion.div>

          {/* Enhanced Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature: Feature, index: number) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.02,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                className="bg-gradient-to-b from-amber-50 to-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-amber-200/60 group relative overflow-hidden"
                style={{ perspective: "1000px" }}
              >
                {/* Animated Background Glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-amber-100/0 via-orange-100/0 to-amber-100/0 rounded-2xl"
                  whileHover={{
                    background: [
                      "linear-gradient(135deg, rgba(245, 158, 11, 0) 0%, rgba(249, 115, 22, 0) 50%, rgba(245, 158, 11, 0) 100%)",
                      "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(249, 115, 22, 0.05) 50%, rgba(245, 158, 11, 0.1) 100%)",
                      "linear-gradient(135deg, rgba(245, 158, 11, 0) 0%, rgba(249, 115, 22, 0) 50%, rgba(245, 158, 11, 0) 100%)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Enhanced Icon Container */}
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.1 + 0.3,
                    type: "spring",
                    stiffness: 200 
                  }}
                  whileHover={{ 
                    rotate: [0, -10, 10, 0],
                    scale: 1.1,
                    transition: { duration: 0.5 }
                  }}
                  className="w-14 h-14 bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                >
                  {/* Icon Glow Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-amber-200/50 to-orange-200/50 rounded-xl"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                  />
                  <motion.div
                    whileHover={{ 
                      rotate: 360,
                      transition: { duration: 0.6, ease: "easeInOut" }
                    }}
                    className="relative z-10"
                  >
                    <feature.icon className="w-6 h-6 text-amber-600 drop-shadow-sm" />
                  </motion.div>
                  {/* Sparkle Effect */}
                  <motion.div
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                  </motion.div>
                </motion.div>

                {/* Animated Title */}
                <motion.h3 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                  viewport={{ once: true }}
                  className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-amber-800 transition-colors duration-300"
                >
                  {feature.title}
                </motion.h3>

                {/* Animated Description */}
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.6 }}
                  viewport={{ once: true }}
                  className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed"
                >
                  {feature.description}
                </motion.p>

                {/* Animated Bottom Border */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-b-2xl"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4 }}
                />

                {/* Floating Elements */}
                <motion.div
                  className="absolute top-2 right-2 w-2 h-2 bg-amber-400/40 rounded-full"
                  animate={{ 
                    y: [0, -8, 0],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Animated Decorative Elements */}
          <motion.div
            className="flex justify-center mt-12 space-x-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            viewport={{ once: true }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-amber-300 rounded-full"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-amber-300/20 to-orange-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tl from-orange-300/30 to-amber-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-amber-200/40 to-orange-200/40 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Floating Sparkles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                opacity: 0
              }}
              animate={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            >
              <Sparkles className={`text-amber-400/60 w-${Math.random() > 0.5 ? '4' : '6'} h-${Math.random() > 0.5 ? '4' : '6'}`} />
            </motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Our <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Success</span> Story
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Numbers that showcase our commitment to culinary excellence and customer satisfaction
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat: Stat, index: number) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.7, 
                  delay: index * 0.15,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="text-center relative group"
              >
                {/* Animated Background Ring */}
                <motion.div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100"
                  initial={false}
                  animate={{ 
                    background: [
                      'linear-gradient(45deg, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.1))',
                      'linear-gradient(45deg, rgba(249, 115, 22, 0.1), rgba(245, 158, 11, 0.1))'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Icon Container with Enhanced Animation */}
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  whileHover={{ 
                    rotate: [0, -10, 10, 0],
                    scale: 1.1
                  }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-white via-amber-50 to-orange-50 rounded-3xl mb-5 group-hover:shadow-2xl transition-all duration-500 border border-amber-200/50 group-hover:border-amber-300/70 relative overflow-hidden"
                >
                  {/* Animated Inner Glow */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-3xl"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div
                    whileHover={{ 
                      rotate: 360,
                      transition: { duration: 0.6 }
                    }}
                  >
                    <stat.icon className="w-8 h-8 text-amber-600 relative z-10 drop-shadow-sm" />
                  </motion.div>
                </motion.div>

                {/* Animated Value with Count-up Effect */}
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1 + 0.5,
                    ease: "backOut"
                  }}
                  className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2 font-serif relative"
                >
                  <motion.span
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.7 }}
                  >
                    {stat.value}
                  </motion.span>
                  {/* Sparkle effect on hover */}
                  <motion.div
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100"
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-6 h-6 text-amber-500" />
                  </motion.div>
                </motion.div>

                {/* Animated Label */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1 + 0.8
                  }}
                  className="text-gray-600 font-semibold text-base tracking-wide"
                >
                  {stat.label}
                </motion.div>

                {/* Animated Underline */}
                <motion.div
                  className="h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mt-2 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: '60%' }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.1 + 1,
                    ease: "easeOut"
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA with Pulse Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl relative overflow-hidden group"
                asChild
              >
                <Link href="/about">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10 flex items-center">
                    Join Our Success Story
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </motion.div>
                  </span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
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

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-amber-50 to-orange-50 text-gray-800 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-tl from-orange-200/40 to-amber-200/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Enhanced Brand Info */}
            <div className="space-y-6 flex flex-col items-center md:items-start">
              {/* Brand Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3">
                  GourmetEats
                </h3>
              </motion.div>

              {/* Description */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-gray-700 leading-relaxed text-base text-center md:text-left max-w-sm"
              >
                Elevating home dining with chef-crafted meals made from the finest seasonal ingredients. Experience culinary excellence delivered to your doorstep.
              </motion.p>

              {/* Enhanced Social Icons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex space-x-4 justify-center md:justify-start"
              >
                {[
                  { icon: Facebook, label: "Facebook" },
                  { icon: Twitter, label: "Twitter" },
                  { icon: Instagram, label: "Instagram" }
                ].map(({ icon: Icon, label }, index) => (
                  <motion.a 
                    key={label}
                    href="#"
                    whileHover={{ 
                      scale: 1.1,
                      y: -2,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 bg-gradient-to-br from-white to-amber-50 rounded-full flex items-center justify-center hover:from-amber-500 hover:to-orange-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg border border-amber-200 hover:border-transparent group"
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  </motion.a>
                ))}
              </motion.div>

              {/* Newsletter Signup */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="w-full max-w-sm"
              >
                <h4 className="text-sm font-semibold text-gray-900 mb-3 text-center md:text-left">Stay Updated</h4>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 text-sm border border-amber-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-medium rounded-r-lg hover:from-amber-700 hover:to-orange-700 transition-colors duration-300">
                    Subscribe
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Enhanced Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-bold text-gray-900 mb-6 relative">
                Navigation
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "Home", href: "/" },
                  { name: "Our Menu", href: "/menu" },
                  { name: "Our Chefs", href: "/about" },
                  { name: "Contact Us", href: "/contact" },
                  { name: "Reservations", href: "/reservations" }
                ].map((link, index) => (
                  <motion.li 
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    viewport={{ once: true }}
                  >
                    <Link 
                      href={link.href} 
                      className="text-gray-600 hover:text-amber-600 transition-colors duration-300 text-sm flex items-center group"
                    >
                      <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Enhanced Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-bold text-gray-900 mb-6 relative">
                Services
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "Food Delivery", icon: Truck },
                  { name: "Catering", icon: ChefHat },
                  { name: "Private Chef", icon: Users },
                  { name: "Meal Planning", icon: Utensils },
                  { name: "Gift Cards", icon: Heart }
                ].map((service, index) => (
                  <motion.li 
                    key={service.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    viewport={{ once: true }}
                    className="flex items-center text-gray-600 hover:text-amber-600 transition-colors duration-300 text-sm group cursor-pointer"
                  >
                    <service.icon className="w-4 h-4 mr-3 text-amber-500 group-hover:scale-110 transition-transform duration-200" />
                    {service.name}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Enhanced Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-bold text-gray-900 mb-6 relative">
                Contact Us
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
              </h4>
              <div className="space-y-4">
                {[
                  { icon: MapPin, text: "123 Gourmet Street, Jaffna, Sri Lanka", label: "Address" },
                  { icon: Phone, text: "+94 76 123 4567", label: "Phone" },
                  { icon: Mail, text: "hello@gourmeteats.lk", label: "Email" }
                ].map((contact, index) => (
                  <motion.div 
                    key={contact.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-3 group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-amber-500 group-hover:to-orange-500 transition-colors duration-300">
                      <contact.icon className="w-4 h-4 text-amber-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{contact.label}</p>
                      <p className="text-gray-700 text-sm leading-relaxed">{contact.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Operating Hours */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                viewport={{ once: true }}
                className="mt-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200"
              >
                <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-amber-600" />
                  Operating Hours
                </h5>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Mon - Fri:</span>
                    <span className="font-medium">10:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sat - Sun:</span>
                    <span className="font-medium">9:00 AM - 11:00 PM</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Enhanced Bottom Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="border-t border-amber-200 mt-12 pt-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                <p className="text-gray-600 text-sm">
                  © {new Date().getFullYear()} GourmetEats. All rights reserved.
                </p>
                <div className="flex space-x-4 text-xs">
                  <Link href="/privacy" className="text-gray-500 hover:text-amber-600 transition-colors duration-300">Privacy Policy</Link>
                  <Link href="/terms" className="text-gray-500 hover:text-amber-600 transition-colors duration-300">Terms of Service</Link>
                  <Link href="/faq" className="text-gray-500 hover:text-amber-600 transition-colors duration-300">FAQ</Link>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Crafted with passion in Sri Lanka</span>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}

export default Home;