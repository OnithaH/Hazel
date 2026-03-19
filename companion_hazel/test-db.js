const { PrismaClient } = require('@prisma/client');

async function main() {
  try {
    const prisma = new PrismaClient({});
    console.log("Instantiated successfully. Connecting...");
    await prisma.$connect();
    console.log("✅ Database connection successful!");
    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ ERROR MESSAGE:");
    console.error(error.message);
  }
}

main();
