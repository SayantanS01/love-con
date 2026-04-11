import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const entries = await prisma.diaryEntry.findMany({
      orderBy: { date: 'desc' },
      include: {
        user: {
          select: { username: true }
        }
      }
    })

    return NextResponse.json(entries)
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { content, moodTag, photoUrl } = await req.json()
    
    if (!content) {
      return NextResponse.json({ message: 'Content is required' }, { status: 400 })
    }

    const newEntry = await prisma.diaryEntry.create({
      data: {
        content,
        moodTag,
        photoUrl,
        userId: session.id,
        replies: '[]' // Initialize with empty JSON array string
      }
    })

    return NextResponse.json(newEntry)
  } catch (error) {
    console.error('Diary error:', error)
    return NextResponse.json({ message: 'Error creating diary entry' }, { status: 500 })
  }
}
