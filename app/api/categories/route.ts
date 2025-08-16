import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/categories - Fetch all categories
export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/categories - Starting request')
    
    const session = await getServerSession(authOptions)
    console.log('Session:', session?.user?.email, 'Role:', session?.user?.role)
    
    if (!session?.user) {
      console.log('No session found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin for admin routes
    if (session.user.role !== 'admin') {
      console.log('User is not admin')
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const categories = await prisma.foodCategory.findMany({
      orderBy: {
        createdAt: 'desc'
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

    console.log(`Found ${categories.length} categories`)
    return NextResponse.json(categories, { status: 200 })
    
  } catch (error) {
    console.error('GET categories error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create new category
export async function POST(req: NextRequest) {
  try {
    console.log('POST /api/categories - Starting request')
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      console.log('Unauthorized access attempt')
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await req.json()
    console.log('Request body:', body)
    
    const { name, description, imageUrl } = body

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

    // Check for existing category with same name (case-insensitive)
    const existingCategory = await prisma.foodCategory.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: 'insensitive'
        }
      }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 }
      )
    }

    // Create new category
    const category = await prisma.foodCategory.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        isActive: true
      }
    })

    console.log('Category created:', category.id)
    return NextResponse.json(category, { status: 201 })
    
  } catch (error) {
    console.error('POST category error:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}