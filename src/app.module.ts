import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { WasteModule } from './waste/waste.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PrismaModule } from './prisma/prisma.module';
import { StatsModule } from './stats/stats.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [PrismaModule, UsersModule, WasteModule, TransactionsModule, StatsModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
