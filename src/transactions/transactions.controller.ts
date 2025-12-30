import { Body, Controller, Get, Post, Logger } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  private readonly logger = new Logger(TransactionsController.name);

  constructor(private transactionsService: TransactionsService) {}

  @Post()
  async create(@Body() body: any) {
    try {
      return await this.transactionsService.create(body);
    } catch (e) {
      this.logger.error('create transaction failed', e as any);
      throw e;
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.transactionsService.findAll();
    } catch (e) {
      this.logger.error('findAll transactions failed', e as any);
      throw e;
    }
  }
}
