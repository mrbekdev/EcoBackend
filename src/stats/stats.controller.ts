import { Controller, Get, Logger, Param } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  private readonly logger = new Logger(StatsController.name);
  constructor(private statsService: StatsService) {}

  @Get(':id')
  async getForUser(@Param('id') id: string) {
    try {
      return await this.statsService.getForUser(id);
    } catch (e) {
      this.logger.error('getForUser failed', e as any);
      throw e;
    }
  }
}
