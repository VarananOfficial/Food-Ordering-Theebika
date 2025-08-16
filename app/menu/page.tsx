'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { FoodCard } from '@/components/food-card'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { toast, Toaster } from 'sonner'
import { ChefHat, Clock, Leaf, Sparkles, Star, Utensils, ShoppingCart, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

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

interface CartItem extends Food {
  quantity: number
}

export default function MenuAndCartPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [foods, setFoods] = useState<Food[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [orderLoading, setOrderLoading] = useState(false)
  const [showCart, setShowCart] = useState(false)
  
  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems
  } = useCart()

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
          category: food.category || ['Italian', 'Asian', 'Mediterranean', 'Desserts'][Math.floor(Math.random() * 4)],
          rating: food.rating || Number((Math.random() * 1 + 4).toFixed(1)),
          prepTime: food.prepTime || `${Math.floor(Math.random() * 20 + 10)}-${Math.floor(Math.random() * 20 + 30)} mins`
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
    setShowCart(true) // Show cart section when item is added
  }

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      toast.success('Item removed from cart')
    } else {
      updateQuantity(itemId, quantity)
    }
  }

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId)
    toast.success('Item removed from cart')
  }

  const handlePlaceOrder = async () => {
    if (!session) {
      toast.error('Please sign in to place an order')
      return
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setOrderLoading(true)

    try {
      const orderItems = cartItems.map(item => ({
        foodId: item.id,
        quantity: item.quantity
      }))

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: orderItems })
      })

      if (response.ok) {
        const orderData = await response.json()
        toast.success('Order placed successfully!')
        clearCart()
        setShowCart(false)
        // Optionally redirect to orders page
        // router.push('/orders')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to place order')
      }
    } catch (error) {
      console.error('Order placement error:', error)
      toast.error('An error occurred while placing your order')
    } finally {
      setOrderLoading(false)
    }
  }

  const filteredFoods = activeCategory === 'All' 
    ? foods 
    : foods.filter(food => food.category === activeCategory)

  return (
    <div className="bg-white min-h-screen">
      <Navbar selected="Food Menu" cartItemsCount={getTotalItems()} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Menu Section - Left Side */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Menu</h1>
              <p className="text-gray-600">Discover our delicious selection of dishes</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Error: {error}</p>
                  <Button onClick={() => fetchFoods()} className="ml-4" size="sm" variant="outline">
                    Retry
                  </Button>
                </div>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="bg-gray-200 h-48"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-200 rounded-lg mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {['All', 'Italian', 'Asian', 'Mediterranean', 'Desserts'].map((category) => (
                    <Button
                      key={category}
                      variant={activeCategory === category ? 'default' : 'outline'}
                      size="sm"
                      className={`${
                        activeCategory === category 
                          ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                          : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600 border-gray-300'
                      }`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                {/* Food Items Grid */}
                {filteredFoods.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <ChefHat className="w-10 h-10 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {activeCategory === 'All' 
                        ? "Our chefs are preparing something special" 
                        : `No ${activeCategory} items available`}
                    </h3>
                    <p className="text-gray-500">New seasonal dishes coming soon</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Cart Section - Right Side */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Card className="shadow-lg">
                <CardHeader className="bg-orange-50">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-orange-600" />
                      <span>Your Cart</span>
                    </div>
                    {cartItems.length > 0 && (
                      <span className="bg-orange-500 text-white text-sm font-medium px-2 py-1 rounded-full">
                        {getTotalItems()}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 max-h-96 overflow-y-auto">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">Your cart is empty</p>
                      <p className="text-gray-400 text-xs mt-1">Add items from the menu</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cartItems.map((item: CartItem) => (
                        <div key={item.id} className="border rounded-lg p-3 bg-gray-50">
                          <div className="flex items-start space-x-3">
                            <div className="relative w-12 h-12 flex-shrink-0">
                              <Image
                                src={item.imageUrl || '/placeholder-food.jpg'}
                                alt={item.name}
                                fill
                                className="object-cover rounded"
                                sizes="48px"
                                // onError={(e) => {
                                //   const target = e.target as HTMLImageElement;
                                //   target.src = '/placeholder-food.jpg';
                                // }}
                              />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {item.name}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                ${item.price.toFixed(2)} each
                              </p>
                              
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="text-sm font-medium px-2">{item.quantity}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-bold text-orange-600">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>

                {cartItems.length > 0 && (
                  <div className="border-t p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery:</span>
                      <span className="font-medium">${getTotalPrice() >= 50 ? '0.00' : '2.99'}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold border-t pt-2">
                      <span>Total:</span>
                      <span className="text-orange-600">
                        ${(getTotalPrice() + (getTotalPrice() >= 50 ? 0 : 2.99)).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <Button
                        onClick={handlePlaceOrder}
                        disabled={orderLoading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        size="sm"
                      >
                        {orderLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                            Ordering...
                          </div>
                        ) : (
                          'Place Order'
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          clearCart()
                          toast.success('Cart cleared')
                        }}
                        className="w-full text-gray-600 hover:text-gray-800"
                      >
                        Clear Cart
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Toaster position="top-center" richColors />
    </div>
  )
}