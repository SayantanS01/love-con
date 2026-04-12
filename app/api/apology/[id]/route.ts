import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const deletedApology = await prisma.apology.delete({
      where: { id }
    })

    return NextResponse.json(deletedApology)
  } catch (error) {
    console.error('Apology DELETE error:', error)
    return NextResponse.json({ message: 'Error deleting apology' }, { status: 500 })
  }
}
