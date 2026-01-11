import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { MaterialPricesService } from './material-prices.service';

@Controller('material-prices')
export class MaterialPricesController {
  constructor(private readonly materialPricesService: MaterialPricesService) {}

  @Get()
  async getPrices(@Query('userId') userId?: string, @Query('role') role?: string) {
    return this.materialPricesService.getPrices(userId, role as any);
  }

  @Post()
  async savePrices(
    @Body() body: { 
      prices: Array<{ material: string; price: number }>;
      userId?: string;
      role?: string;
    }
  ) {
    return this.materialPricesService.savePrices(body.prices, body.userId, body.role as any);
  }

  @Get('material/:material')
  async getPriceByMaterial(
    @Param('material') material: string,
    @Query('userId') userId?: string,
    @Query('role') role?: string
  ) {
    const price = await this.materialPricesService.getPriceByMaterial(material, userId, role as any);
    return { material, price };
  }
}
