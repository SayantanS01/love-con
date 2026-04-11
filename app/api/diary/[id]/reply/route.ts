import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getSession()
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { content } = await req.json()
    if (!content) return NextResponse.json({ message: 'Content required' }, { status: 400 })

    const entry = await prisma.diaryEntry.findUnique({
      where: { id }
    })

    if (!entry) return NextResponse.json({ message: 'Entry not found' }, { status: 404 })

    const replies = JSON.parse(entry.replies || '[]')
    const newReply = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      username: session.username,
      timestamp: new Date().toISOString()
    }

    replies.push(newReply)

    const updatedEntry = await prisma.diaryEntry.update({
      where: { id },
      data: {
        replies: JSON.stringify(replies)
      }
    })

    return NextResponse.json(newReply)
  } catch (error) {
    console.error('Reply error:', error)
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}
