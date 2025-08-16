import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Fetching all foods...')
    
    // Fetch all foods
    const foods = await prisma.food.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    console.log(`Found ${foods.length} foods`)
    
    // If there are no foods, return empty array
    if (foods.length === 0) {
      return NextResponse.json([])
    }
    
    // Get all unique category IDs from foods
    const categoryIds = [...new Set(foods.filter(f => f.categoryId).map(f => f.categoryId))] as string[]
    
    // Fetch categories only if there are any to fetch
    let categoryMap = new Map<string, string>()
    if (categoryIds.length > 0) {
      try {
        const categories = await prisma.foodCategory.findMany({
          where: {
            id: {
              in: categoryIds
            }
          },
          select: {
            id: true,
            name: true
          }
        })
        categoryMap = new Map(categories.map(cat => [cat.id, cat.name]))
      } catch (catError) {
        console.error('Error fetching categories:', catError)
        // Continue without category names if there's an error
      }
    }
    
    // Transform the data to match the frontend expectations
    const transformedFoods = foods.map(food => ({
      id: food.id,
      name: food.name,
      description: food.description,
      price: food.price,
      imageUrl: food.imageUrl || null,
      image_path: food.imageUrl || null,
      category_id: food.categoryId || null,
      category_name: food.categoryId ? (categoryMap.get(food.categoryId) || null) : null
    }))
    
    console.log('Returning transformed foods:', transformedFoods.length)
    return NextResponse.json(transformedFoods)
  } catch (error) {
    console.error('Get foods error:', error)
    // Return empty array instead of error to prevent frontend from breaking
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  let body: any = null;
  
  try {
    // First, try to get the session
    let session;
    try {
      session = await getServerSession(authOptions)
    } catch (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Authentication service error' }, { status: 500 })
    }
    
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Try to parse the request body
    try {
      body = await req.json()
      console.log('Received body:', JSON.stringify(body, null, 2))
    } catch (parseError) {
      console.error('Body parsing error:', parseError)
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }
    
    const { name, description, price, image_path, imageUrl, category_id } = body

    // Validate required fields
    if (!name?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      )
    }

    if (price === undefined || price === null || price === '') {
      return NextResponse.json(
        { error: 'Price is required' },
        { status: 400 }
      )
    }

    // Validate price
    const numericPrice = parseFloat(price.toString())
    if (isNaN(numericPrice) || numericPrice < 0) {
      return NextResponse.json(
        { error: 'Price must be a valid positive number' },
        { status: 400 }
      )
    }

    // Check if Prisma is connected
    try {
      await prisma.$connect()
    } catch (dbError) {
      console.error('Database connection error:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 500 }
      )
    }

    // Prepare data for creation - start with required fields only
    const createData: any = {
      name: name.trim(),
      description: description.trim(),
      price: numericPrice
    }

    // Add optional imageUrl if provided
    const finalImageUrl = image_path || imageUrl
    if (finalImageUrl && finalImageUrl.trim() !== '') {
      createData.imageUrl = finalImageUrl.trim()
    }
    // If no image, don't set imageUrl at all (let it default to null)

    // Handle optional category
    let validCategoryId: string | null = null
    if (category_id && category_id.trim() !== '' && category_id !== 'no-category') {
      try {
        const categoryExists = await prisma.foodCategory.findUnique({
          where: { id: category_id }
        })
        
        if (categoryExists) {
          validCategoryId = category_id
          createData.categoryId = category_id
        } else {
          console.log('Category not found, creating without category:', category_id)
        }
      } catch (catError) {
        console.error('Category check error:', catError)
      }
    }
    // If no valid category, don't set categoryId at all (let it default to null)

    console.log('Creating food with data:', JSON.stringify(createData, null, 2))

    // Try to create the food item
    let food;
    try {
      food = await prisma.food.create({
        data: createData
      })
    } catch (createError: any) {
      console.error('Prisma create error:', createError)
      
      // Check for specific Prisma errors
      if (createError.code === 'P2002') {
        return NextResponse.json(
          { error: 'A food item with this name already exists' },
          { status: 400 }
        )
      }
      
      if (createError.code === 'P2003') {
        return NextResponse.json(
          { error: 'Invalid category reference' },
          { status: 400 }
        )
      }
      
      // Check if it's a required field error
      if (createError.message?.includes('Argument') && createError.message?.includes('is missing')) {
        return NextResponse.json(
          { error: `Database schema error: ${createError.message}. Please ensure imageUrl and categoryId are optional in your schema.` },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { error: `Database error: ${createError.message || 'Unknown database error'}` },
        { status: 500 }
      )
    }

    // Get category name if category was set
    let categoryName: string | null = null
    if (food.categoryId) {
      try {
        const category = await prisma.foodCategory.findUnique({
          where: { id: food.categoryId },
          select: { name: true }
        })
        categoryName = category?.name || null
      } catch (error) {
        console.error('Error fetching category name:', error)
      }
    }

    // Transform response to match frontend expectations
    const response = {
      id: food.id,
      name: food.name,
      description: food.description,
      price: food.price,
      imageUrl: food.imageUrl || null,
      image_path: food.imageUrl || null,
      category_id: food.categoryId || null,
      category_name: categoryName
    }

    console.log('Food created successfully:', JSON.stringify(response, null, 2))
    return NextResponse.json(response, { status: 201 })
    
  } catch (error: any) {
    // This is the outer catch for any unexpected errors
    console.error('Unexpected error in POST /api/foods:', error)
    console.error('Error stack:', error.stack)
    console.error('Request body was:', body)
    
    // Always return a JSON response
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred', 
        details: error.message || 'Unknown error',
        type: error.constructor.name
      },
      { status: 500 }
    )
  }
}