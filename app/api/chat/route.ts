import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const messages = await prisma.chatMessage.findMany({
      orderBy: { timestamp: 'asc' },
      take: 50,
      include: {
        sender: {
          select: { username: true }
        }
      }
    })

    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { content } = await req.json()
    if (!content) return NextResponse.json({ message: 'Content required' }, { status: 400 })

    const newMessage = await prisma.chatMessage.create({
      data: {
        content,
        senderId: session.id,
      },
      include: {
        sender: {
          select: { username: true }
        }
      }
    })

    return NextResponse.json(newMessage)
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}
