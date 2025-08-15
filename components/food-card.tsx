'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'

interface Food {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
}

interface FoodCardProps {
  food: Food
  onAddToCart: (food: Food) => void
}

export function FoodCard({ food, onAddToCart }: FoodCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <Image
          src={food.imageUrl}
          alt={food.name}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{food.name}</CardTitle>
        <CardDescription className="line-clamp-2">{food.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-orange-500">${food.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onAddToCart(food)}
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}