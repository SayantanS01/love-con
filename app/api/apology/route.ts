import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    // Rule: Apologies are only visible for exactly 3 days (72 hours)
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

    const apologies = await prisma.apology.findMany({
      where: {
        createdAt: {
          gte: threeDaysAgo
        }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { username: true }
        }
      }
    })

    return NextResponse.json(apologies)
  } catch (error) {
    console.error('Apology GET error:', error)
    return NextResponse.json({ message: 'Error fetching apologies' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { message } = await req.json()
    
    if (!message || message.trim() === '') {
      return NextResponse.json({ message: 'Message is required' }, { status: 400 })
    }

    const newApology = await prisma.apology.create({
      data: {
        message,
        userId: session.id
      }
    })

    return NextResponse.json(newApology)
  } catch (error) {
    console.error('Apology POST error:', error)
    return NextResponse.json({ message: 'Error adding apology' }, { status: 500 })
  }
}
