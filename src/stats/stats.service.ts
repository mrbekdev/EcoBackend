import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getForUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const totalAgg = await this.prisma.wasteReport.aggregate({
      where: { userId: id },
      _sum: { estimatedWeight: true },
      _count: { id: true },
      _avg: { estimatedWeight: true },
    });

    const todayAgg = await this.prisma.wasteReport.aggregate({
      where: { userId: id, createdAt: { gte: start } },
      _sum: { estimatedWeight: true },
      _count: { id: true },
    });

    const todayTx = await this.prisma.transaction.aggregate({
      where: { userId: id, createdAt: { gte: start } },
      _sum: { amount: true },
    });

    const totalWaste = totalAgg._sum.estimatedWeight ?? 0;
    const totalCount = totalAgg._count.id ?? 0;
    const avgWaste = totalCount > 0 ? (totalWaste / totalCount) : 0;

    return {
      balance: user.balance ?? 0,
      totalWaste,
      todayWaste: todayAgg._sum.estimatedWeight ?? 0,
      customersServed: todayAgg._count.id ?? 0,
      averageWaste: avgWaste,
      todayEarnings: todayTx._sum.amount ?? 0,
    };
  }
}
