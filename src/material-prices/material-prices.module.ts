import { Module } from '@nestjs/common';
import { MaterialPricesController } from './material-prices.controller';
import { MaterialPricesService } from './material-prices.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MaterialPricesController],
  providers: [MaterialPricesService],
  exports: [MaterialPricesService],
})
export class MaterialPricesModule {}
