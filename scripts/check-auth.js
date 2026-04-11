const { PrismaClient } = require('@prisma/client')
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
const bcrypt = require('bcryptjs')

const adapter = new PrismaBetterSqlite3({ url: 'dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  const users = await prisma.user.findMany()
  console.log('Users found:', users.map(u => ({ username: u.username, role: u.role })))
  
  for (const user of users) {
    const isSayanBase = await bcrypt.compare('Sayan@2001', user.password)
    const isSayanUser = await bcrypt.compare('ILoveMampi100', user.password)
    const isMampiUser = await bcrypt.compare('ILoveDipu100', user.password)
    console.log(`User ${user.username}:`, { isSayanBase, isSayanUser, isMampiUser })
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
