import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({origin:true });

  // Serve uploaded files statically
  app.useStaticAssets('uploads', {
    prefix: '/uploads',
  });

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Ensure there are seed users if none exist (convenience for local dev).
  try {
    const count = await prismaService.user.count();
    if (count === 0) {
      const hash = async (p: string) => {
        const s = await bcrypt.genSalt(10);
        return bcrypt.hash(p, s);
      };

      await prismaService.user.createMany({
        data: [
          {
            username: 'user1',
            password: await hash('123'),
            role: 'user',
            balance: 50000,
            name: 'Oddiy Foydalanuvchi',
            location: 'Toshkent'
          },
          {
            username: 'point1',
            password: await hash('123'),
            role: 'collection_point',
            balance: 150000,
            name: 'Chiqindi Punkti #1',
            location: 'Chilonzor tumani'
          },
          {
            username: 'factory1',
            password: await hash('123'),
            role: 'factory',
            balance: 500000,
            name: 'Qayta Ishlash Zavodi',
            location: 'Toshkent viloyati'
          }
        ]
      });
      console.log('Default users created');
    }
  } catch (e) {
    console.warn('Seeding users on startup failed', e);
  }

  await app.listen(process.env.PORT ?? 5000);
}

bootstrap();
