import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WasteService {
  constructor(private prisma: PrismaService) {}

  async create(report: any) {
    return this.prisma.wasteReport.create({ data: report });
  }

  async findAll() {
    return this.prisma.wasteReport.findMany({ include: { user: true } });
  }
}
