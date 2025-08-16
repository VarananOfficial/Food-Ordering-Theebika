import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import path from 'path'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { imageUrl } = await request.json()

    if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
      return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 })
    }

    const filepath = path.join(process.cwd(), 'public', imageUrl)
    
    try {
      await unlink(filepath)
      return NextResponse.json({ message: 'File deleted successfully' })
    } catch (error) {
      if (error === 'ENOENT') {
        return NextResponse.json({ message: 'File not found' }, { status: 404 })
      }
      throw error
    }
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}