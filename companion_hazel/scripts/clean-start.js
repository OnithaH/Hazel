const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Clean Seed...');

  // 1. Create a Master User for the Robot
  const user = await prisma.user.upsert({
    where: { email: 'team@hazel.com' },
    update: {},
    create: {
      clerk_id: 'team_master_user',
      email: 'team@hazel.com',
      name: 'Hazel Team',
    },
  });

  console.log('✅ Master User Created:', user.email);

  // 2. Create the Master Robot
  const robot = await prisma.robot.create({
    data: {
      name: 'Hazel Master',
      user_id: user.id,
    },
  });

  console.log('\n' + '⭐'.repeat(30));
  console.log('✨ MASTER ROBOT CREATED SUCCESSFULLY! ✨');
  console.log('⭐'.repeat(30));
  console.log('\n' + '  NAME       :', robot.name);
  console.log('  ROBOT ID   :', robot.id);
  console.log('  SECRET KEY :', robot.secret_key, ' <--- COPY THIS TO THE Pi');
  console.log('\n' + '⭐'.repeat(30));
}

main()
  .catch((e) => {
    console.error('❌ Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
