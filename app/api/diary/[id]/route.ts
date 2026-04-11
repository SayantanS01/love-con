import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await prisma.diaryEntry.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Deleted' })
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}
