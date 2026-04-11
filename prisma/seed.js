require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { Pool } = require('pg')
const { PrismaPg } = require('@prisma/adapter-pg')
const bcrypt = require('bcryptjs')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const adminPass = await bcrypt.hash('Sayan@2001', 10)
  const sayanUserPass = await bcrypt.hash('ILoveMampi100', 10)
  const mampiUserPass = await bcrypt.hash('ILoveDipu100', 10)

  // Admin Account
  const admin = await prisma.user.upsert({
    where: { username: 'SayantanS01' },
    update: {},
    create: {
      username: 'SayantanS01',
      password: adminPass,
      role: 'ADMIN',
    },
  })

  // Sayantan User Account
  const sayan = await prisma.user.upsert({
    where: { username: 'SayantanM01' },
    update: {},
    create: {
      username: 'SayantanM01',
      password: sayanUserPass,
      role: 'USER',
    },
  })

  // Mampi User Account
  const mampi = await prisma.user.upsert({
    where: { username: 'MampiS03' },
    update: {},
    create: {
      username: 'MampiS03',
      password: mampiUserPass,
      role: 'USER',
    },
  })

  console.log({ admin, sayan, mampi })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
