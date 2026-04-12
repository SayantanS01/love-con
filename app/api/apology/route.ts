import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const apologies = await prisma.apology.findMany({
      where: {
        userId: {
          not: session.id
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
