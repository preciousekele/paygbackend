const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createWalletForUser(userId) {
  const existingWallet = await prisma.wallet.findUnique({
    where: { userId }
  });

  if (!existingWallet) {
    const wallet = await prisma.wallet.create({
      data: {
        userId,
        balance: 2000,  // starting balance for testing
      },
    });
    console.log('Wallet created:', wallet);
  } else {
    console.log('Wallet already exists:', existingWallet);
  }
}

createWalletForUser(1)
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
