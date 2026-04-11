import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { password } = await req.json()
    const hashedPassword = await bcrypt.hash(password, 10)
    
    await prisma.user.update({
      where: { id: session.userId },
      data: { password: hashedPassword }
    })

    // Log the security change
    await prisma.activityLog.create({
      data: {
        action: 'Updated Secret Code (Password)',
        username: session.username,
        userId: session.userId
      }
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
