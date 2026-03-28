const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  const robot = await prisma.robot.findFirst({
    where: { name: 'Hazel Master' }
  });
  if (robot) {
    fs.writeFileSync('real_secret.txt', robot.secret_key);
    console.log('✅ SECRET SAVED TO real_secret.txt');
  } else {
    console.log('❌ Hazel Master not found.');
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});
