import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/categories/[id] - Get single category
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const category = await prisma.foodCategory.findUnique({
      where: {
        id: params.id
      },
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json(category)
    
  } catch (error) {
    console.error('GET category error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

// PUT /api/categories/[id] - Update category
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await req.json()
    const { name, description, imageUrl, isActive } = body

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Category name is required and must be a valid string' },
        { status: 400 }
      )
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Category name must be at least 2 characters long' },
        { status: 400 }
      )
    }

    if (name.trim().length > 100) {
      return NextResponse.json(
        { error: 'Category name must be less than 100 characters' },
        { status: 400 }
      )
    }

    // Check if category exists
    const existingCategory = await prisma.foodCategory.findUnique({
      where: { id: params.id }
    })

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Check for name conflicts (excluding current category)
    const duplicateCategory = await prisma.foodCategory.findFirst({
      where: {
        AND: [
          {
            name: {
              equals: name.trim(),
              mode: 'insensitive'
            }
          },
          {
            id: {
              not: params.id
            }
          }
        ]
      }
    })

    if (duplicateCategory) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 }
      )
    }

    // Update category
    const updatedCategory = await prisma.foodCategory.update({
      where: { id: params.id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined
      }
    })

    return NextResponse.json(updatedCategory)
    
  } catch (error) {
    console.error('PUT category error:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE /api/categories/[id] - Delete category
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Check if category exists
    const existingCategory = await prisma.foodCategory.findUnique({
      where: { id: params.id },
      include: {
        foods: true // Check if category has associated foods
      }
    })

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Check if category has associated foods
    if (existingCategory.foods && existingCategory.foods.length > 0) {
      return NextResponse.json(
        { 
          error: `Cannot delete category. It has ${existingCategory.foods.length} associated food item(s). Please move or delete the food items first.` 
        },
        { status: 409 }
      )
    }

    // Delete category
    await prisma.foodCategory.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Category deleted successfully' })
    
  } catch (error) {
    console.error('DELETE category error:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}