'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AdminNavbar } from '@/components/admin/admin-navbar'
import { FoodForm } from '@/components/admin/food-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast, Toaster } from 'sonner'
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Food {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
}

export default function AdminFoods() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [foods, setFoods] = useState<Food[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingFood, setEditingFood] = useState<Food | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
    if (session.user.role !== 'admin') {
      router.push('/')
      return
    }
    fetchFoods()
  }, [session, status, router])

  const fetchFoods = async () => {
    try {
      const response = await fetch('/api/foods')
      if (response.ok) {
        const data = await response.json()
        setFoods(data)
      }
    } catch (error) {
      console.error('Error fetching foods:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this food item?')) return

    try {
      const response = await fetch(`/api/foods/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Food item deleted!')
        fetchFoods()
      } else {
        toast.error('Failed to delete food item')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingFood(null)
    fetchFoods()
  }

  const handleEdit = (food: Food) => {
    setEditingFood(food)
    setShowForm(true)
  }

  if (status === 'loading' || loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!session || session.user.role !== 'admin') {
    return null
  }

  return (
    <div>
      <AdminNavbar />
      <Toaster position="top-center" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/admin" className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Food Management</h1>
              <p className="text-gray-600">Manage your menu items</p>
            </div>
            <Button onClick={() => setShowForm(true)} disabled={showForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Food Item
            </Button>
          </div>
        </div>

        {showForm && (
          <div className="mb-8">
            <FoodForm
              food={editingFood}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setShowForm(false)
                setEditingFood(null)
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map((food) => (
            <Card key={food.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={food.imageUrl}
                  alt={food.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-1">{food.name}</CardTitle>
                  <Badge variant="secondary">${food.price.toFixed(2)}</Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{food.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(food)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(food.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {foods.length === 0 && !loading && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No food items found</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Food Item
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}