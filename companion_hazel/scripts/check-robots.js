const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const robots = await prisma.robot.findMany();
  console.log('🤖 ROBOTS IN DB:', JSON.stringify(robots, null, 2));
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
