import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hash(p: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(p, salt);
}

async function main() {
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: await hash('123'),
      role: 'admin',
      balance: 0,
      name: 'Administrator',
      location: 'Toshkent'
    }
  });

  await prisma.user.upsert({
    where: { username: 'user1' },
    update: {},
    create: {
      username: 'user1',
      password: await hash('123'),
      role: 'user',
      balance: 50000,
      name: 'Oddiy Foydalanuvchi',
      location: 'Toshkent'
    }
  });

  await prisma.user.upsert({
    where: { username: 'point1' },
    update: {},
    create: {
      username: 'point1',
      password: await hash('123'),
      role: 'collection_point',
      balance: 150000,
      name: 'Chiqindi Punkti #1',
      location: 'Chilonzor tumani'
    }
  });

  await prisma.user.upsert({
    where: { username: 'factory1' },
    update: {},
    create: {
      username: 'factory1',
      password: await hash('123'),
      role: 'factory',
      balance: 500000,
      name: 'Qayta Ishlash Zavodi',
      location: 'Toshkent viloyati'
    }
  });

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
