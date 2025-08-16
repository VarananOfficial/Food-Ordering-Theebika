'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast, Toaster } from 'sonner'
import { ArrowLeft, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface CartItem {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  quantity: number
  category?: string
  rating?: number
  prepTime?: string
}

export default function Cart() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems
  } = useCart()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setLoading(true)

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
        router.push('/orders')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to place order')
      }
    } catch (error) {
      console.error('Order placement error:', error)
      toast.error('An error occurred while placing your order')
    } finally {
      setLoading(false)
    }
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

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  console.log('Cart Items:', cartItems) // Debug log to see cart items

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartItemsCount={getTotalItems()} />
      <Toaster position="top-center" richColors />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Menu
          </Link>
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
            {cartItems.length > 0 && (
              <span className="bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {getTotalItems()} items
              </span>
            )}
          </div>
        </div>

        {cartItems.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 text-lg mb-6">Add some delicious items to get started!</p>
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
                <Link href="/">Browse Menu</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Items in your cart</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    clearCart()
                    toast.success('Cart cleared')
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Clear all
                </Button>
              </div>
              
              {/* Display each cart item */}
              {cartItems.map((item: CartItem) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                        <Image
                          src={item.imageUrl || '/placeholder-food.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                          sizes="(max-width: 640px) 80px, 96px"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-food.jpg';
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                              {item.description}
                            </p>
                            {item.category && (
                              <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mt-2">
                                {item.category}
                              </span>
                            )}
                          </div>

                          {/* Price and Actions */}
                          <div className="flex flex-col items-end space-y-3 mt-3 sm:mt-0 sm:ml-4">
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-500">
                                ${item.price.toFixed(2)} each
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="h-8 w-8 p-0 hover:bg-gray-200"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              
                              <span className="w-12 text-center font-medium text-gray-900 px-2">
                                {item.quantity}
                              </span>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 p-0 hover:bg-gray-200"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="ml-1 text-sm">Remove</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 shadow-lg">
                <CardHeader className="bg-gray-50">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                      <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-medium">${getTotalPrice() >= 50 ? '0.00' : '2.99'}</span>
                    </div>
                    {getTotalPrice() >= 50 && (
                      <div className="text-sm text-green-600 font-medium">
                        🎉 Free delivery on orders over $50!
                      </div>
                    )}
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-orange-600">
                          ${(getTotalPrice() + (getTotalPrice() >= 50 ? 0 : 2.99)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={loading || cartItems.length === 0}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3"
                    size="lg"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Placing Order...
                      </div>
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                  
                  <div className="text-xs text-gray-500 text-center">
                    By placing this order, you agree to our terms and conditions
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}