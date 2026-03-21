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

    // 3. Create Sample Aroma Configuration
    const existingAroma = await prisma.aromaConfiguration.findFirst({
      where: { robot_id: robot.id }
    });

    if (!existingAroma) {
      await prisma.aromaConfiguration.createMany({
        data: [
          { robot_id: robot.id, chamber_number: 1, scent_name: 'Peppermint', intensity: 80, color_hex: '#3B82F6' },
          { robot_id: robot.id, chamber_number: 2, scent_name: 'Lavender', intensity: 60, color_hex: '#A855F7' },
          { robot_id: robot.id, chamber_number: 3, scent_name: 'Lemon', intensity: 90, color_hex: '#FACC15' },
        ],
      });
      console.log('✅ Created sample aroma configurations');
    }

    // 4. Create Sample Mode Usage Logs for last 7 days
    const existingLogs = await prisma.modeUsageLog.findFirst({
      where: { robot_id: robot.id }
    });

    if (!existingLogs) {
      const logs = [];
      const modes = ['STUDY', 'GAME', 'MUSIC', 'GENERAL'];
      for (let i = 0; i < 14; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(i / 2));
        date.setHours(10 + (i % 2) * 4, 0, 0, 0);

        const duration = Math.floor(Math.random() * 120) + 30; // 30-150 mins
        const endTime = new Date(date.getTime() + duration * 60000);

        logs.push({
          robot_id: robot.id,
          mode: modes[i % 4],
          start_time: date,
          end_time: endTime,
        });
      }

      await prisma.modeUsageLog.createMany({ data: logs });
      console.log('✅ Created sample mode usage logs');
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
