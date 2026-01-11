import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { WasteModule } from './waste/waste.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PrismaModule } from './prisma/prisma.module';
import { StatsModule } from './stats/stats.module';
import { AdminModule } from './admin/admin.module';
import { MaterialPricesModule } from './material-prices/material-prices.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 🔥 MUHIM
    }),
    PrismaModule,
    UsersModule,
    WasteModule,
    TransactionsModule,
    StatsModule,
    AdminModule,
    MaterialPricesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
