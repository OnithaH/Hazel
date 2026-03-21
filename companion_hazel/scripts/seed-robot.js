const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting development seeding...');

  try {
    // 1. Create/Find a test user
    // In a real dev environment, you might want to use your actual Clerk ID here
    const clerkId = process.argv[2] || 'user_test_123';
    
    let user = await prisma.user.findUnique({
      where: { clerk_id: clerkId }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerk_id: clerkId,
          email: `${clerkId}@example.com`,
          name: 'Test User',
        }
      });
      console.log('✅ Created test user:', user.email);
    } else {
      console.log('ℹ️ User already exists:', user.email);
    }

    // 2. Create/Find a robot for the user
    let robot = await prisma.robot.findFirst({
      where: { user_id: user.id }
    });

    if (!robot) {
      robot = await prisma.robot.create({
        data: {
          name: 'Companion Robot',
          user_id: user.id,
        }
      });
      console.log('✅ Created companion robot:', robot.name);
    } else {
      console.log('ℹ️ Robot already exists:', robot.name);
    }

    console.log('\n-----------------------------------');
    console.log('🔑 Robot Details for Swagger/Testing:');
    console.log('Robot Secret (x-robot-secret):', robot.secret_key);
    console.log('Robot ID:', robot.id);
    console.log('User Clerk ID:', user.clerk_id);
    console.log('-----------------------------------\n');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
