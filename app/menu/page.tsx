'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { FoodCard } from '@/components/food-card'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { toast, Toaster } from 'sonner'
import { ChefHat, Clock, Leaf, Sparkles, Star, Utensils } from 'lucide-react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'

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

export default function FoodMenuPage() {
  const { data: session } = useSession()
  const [foods, setFoods] = useState<Food[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('All')
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

  const filteredFoods = activeCategory === 'All' 
    ? foods 
    : foods.filter(food => food.category === activeCategory)

  return (
    <div className="bg-white">
      <Navbar selected="Food Menu" cartItemsCount={3} />
      <section className="py-12 bg-white" id="menu">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
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
            <div className="flex flex-col md:flex-row gap-8">
              {/* Vertical Category List - Left Side */}
              <div className="w-full md:w-64 flex-shrink-0">
                <div className="sticky top-4 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 pl-2">Categories</h3>
                  {['All', 'Italian', 'Asian', 'Mediterranean', 'Desserts'].map((category) => (
                    <Button
                      key={category}
                      variant={activeCategory === category ? 'default' : 'ghost'}
                      size="sm"
                      className={`w-full justify-start rounded-lg px-4 py-2 ${activeCategory === category ? 'bg-amber-100 text-amber-800' : 'text-gray-700 hover:bg-amber-50'}`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Food Items Grid - Right Side */}
              <div className="flex-1">
                {filteredFoods.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredFoods.map((food) => (
                      <motion.div 
                        key={food.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ y: -5 }}
                        className="relative"
                      >
                        <FoodCard
                          food={food}
                          onAddToCart={handleAddToCart}
                          className="h-full"
                        />
                        {food.rating && (
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center text-xs font-medium">
                            <Star className="w-3 h-3 text-amber-500 fill-current mr-1" />
                            {food.rating}
                          </div>
                        )}
                        {food.prepTime && (
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {food.prepTime}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 bg-amber-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <ChefHat className="w-12 h-12 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {activeCategory === 'All' 
                        ? "Our chefs are preparing something special" 
                        : `No ${activeCategory} items available`}
                    </h3>
                    <p className="text-gray-500">New seasonal dishes coming soon</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
      <Toaster position="top-center" richColors />
    </div>
  )
}