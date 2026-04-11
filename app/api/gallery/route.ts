import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const photos = await prisma.photo.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { username: true }
        }
      }
    })

    return NextResponse.json(photos)
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { caption, imageUrl } = await req.json()
    
    if (!imageUrl) {
      return NextResponse.json({ message: 'Image URL is required' }, { status: 400 })
    }

    const newPhoto = await prisma.photo.create({
      data: {
        caption,
        imageUrl,
        userId: session.id
      }
    })

    return NextResponse.json(newPhoto)
  } catch (error) {
    console.error('Gallery error:', error)
    return NextResponse.json({ message: 'Error adding photo' }, { status: 500 })
  }
}
