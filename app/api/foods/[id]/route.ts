import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, price, image_path, imageUrl, category_id } = body

    // Validate required fields
    if (!name || !description || price === undefined || price === null) {
      return NextResponse.json(
        { error: 'Name, description, and price are required' },
        { status: 400 }
      )
    }

    // Validate price
    const numericPrice = parseFloat(price)
    if (isNaN(numericPrice) || numericPrice < 0) {
      return NextResponse.json(
        { error: 'Price must be a valid positive number' },
        { status: 400 }
      )
    }

    // Check if food exists
    const existingFood = await prisma.food.findUnique({
      where: { id: params.id }
    })

    if (!existingFood) {
      return NextResponse.json(
        { error: 'Food item not found' },
        { status: 404 }
      )
    }

    // Prepare update data with required fields
    const updateData: any = {
      name: name.trim(),
      description: description.trim(),
      price: numericPrice
    }

    // Handle image update
    const finalImageUrl = image_path || imageUrl
    if (finalImageUrl !== undefined) {
      // Allow explicitly setting to empty to remove image
      updateData.imageUrl = finalImageUrl && finalImageUrl.trim() !== '' ? finalImageUrl.trim() : null
    }

    // Handle category update
    if (category_id === '' || category_id === null || category_id === 'no-category') {
      // Set to null to remove category
      updateData.categoryId = null
    } else if (category_id !== undefined) {
      // Verify category exists before setting
      const categoryExists = await prisma.foodCategory.findUnique({
        where: { id: category_id }
      })
      
      if (categoryExists) {
        updateData.categoryId = category_id
      } else if (category_id) {
        return NextResponse.json(
          { error: 'Invalid category selected' },
          { status: 400 }
        )
      }
    }
    // If category_id is undefined, don't update it

    const updatedFood = await prisma.food.update({
      where: { id: params.id },
      data: updateData
    })

    // Get category name if category exists
    let categoryName: string | null = null
    if (updatedFood.categoryId) {
      try {
        const category = await prisma.foodCategory.findUnique({
          where: { id: updatedFood.categoryId },
          select: { name: true }
        })
        categoryName = category?.name || null
      } catch (error) {
        console.error('Error fetching category name:', error)
      }
    }

    // Transform response to match frontend expectations
    const response = {
      id: updatedFood.id,
      name: updatedFood.name,
      description: updatedFood.description,
      price: updatedFood.price,
      imageUrl: updatedFood.imageUrl || null,
      image_path: updatedFood.imageUrl || null,
      category_id: updatedFood.categoryId || null,
      category_name: categoryName
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Update food error:', error)
    return NextResponse.json(
      { error: 'Failed to update food item. Please try again.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if food exists
    const existingFood = await prisma.food.findUnique({
      where: { id: params.id }
    })

    if (!existingFood) {
      return NextResponse.json(
        { error: 'Food item not found' },
        { status: 404 }
      )
    }

    // Check if food is used in any orders
    const orderItemsCount = await prisma.orderItem.count({
      where: { foodId: params.id }
    })

    if (orderItemsCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete food item that has been ordered. Consider deactivating it instead.' },
        { status: 400 }
      )
    }

    await prisma.food.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete food error:', error)
    return NextResponse.json(
      { error: 'Failed to delete food item. Please try again.' },
      { status: 500 }
    )
  }
}