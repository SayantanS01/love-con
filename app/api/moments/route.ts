import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const moments = await prisma.moment.findMany({
      orderBy: { date: 'desc' },
      include: {
        user: {
          select: { username: true }
        }
      }
    })

    return NextResponse.json(moments)
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { title, date, photoUrl, note } = await req.json()
    
    if (!title || !date) {
      return NextResponse.json({ message: 'Title and date are required' }, { status: 400 })
    }

    const newMoment = await prisma.moment.create({
      data: {
        title,
        date: new Date(date),
        photoUrl,
        note,
        userId: session.id
      }
    })

    return NextResponse.json(newMoment)
  } catch (error) {
    console.error('Moment error:', error)
    return NextResponse.json({ message: 'Error creating moment' }, { status: 500 })
  }
}
