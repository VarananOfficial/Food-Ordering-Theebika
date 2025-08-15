import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        orderItems: {
          include: {
            food: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { items } = await req.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid order items' },
        { status: 400 }
      )
    }

    // Calculate total price
    let totalPrice = 0
    const foodItems = await Promise.all(
      items.map(async (item: { foodId: string; quantity: number }) => {
        const food = await prisma.food.findUnique({
          where: { id: item.foodId }
        })
        if (!food) throw new Error(`Food item ${item.foodId} not found`)
        
        totalPrice += food.price * item.quantity
        return { food, quantity: item.quantity }
      })
    )

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalPrice,
        status: 'Pending',
        orderItems: {
          create: foodItems.map(({ food, quantity }) => ({
            foodId: food.id,
            quantity
          }))
        }
      },
      include: {
        orderItems: {
          include: {
            food: true
          }
        }
      }
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}