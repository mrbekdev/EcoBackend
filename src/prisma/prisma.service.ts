import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // Prisma 5+ uses the library engine which doesn't support the client's
    // 'beforeExit' event. Listen on the process events instead to gracefully
    // shutdown the Nest application and disconnect Prisma.
    process.once('beforeExit', async () => {
      await app.close();
    });

    // Handle termination signals to properly disconnect Prisma and exit.
    process.once('SIGINT' as any, async () => {
      await this.$disconnect();
      process.exit(0);
    });

    process.once('SIGTERM' as any, async () => {
      await this.$disconnect();
      process.exit(0);
    });
  }
}
