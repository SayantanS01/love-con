import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    let settings = await prisma.globalSetting.findUnique({
      where: { id: 'singleton' }
    })
    
    if (!settings) {
      settings = await prisma.globalSetting.create({
        data: { id: 'singleton' }
      })
    }
    
    return NextResponse.json(settings)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getSession()
  if (session?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { primaryColor, accentColor, activeSongId } = await req.json()
    
    const settings = await prisma.globalSetting.upsert({
      where: { id: 'singleton' },
      update: { primaryColor, accentColor, activeSongId },
      create: { id: 'singleton', primaryColor, accentColor, activeSongId }
    })

    // Log the activity
    await prisma.activityLog.create({
      data: {
        action: `Updated Sanctuary Theme: ${primaryColor}`,
        username: session.username,
        userId: session.userId
      }
    })

    return NextResponse.json(settings)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
