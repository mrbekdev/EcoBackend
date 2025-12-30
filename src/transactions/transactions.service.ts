import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(tx: { userId: string; amount: number; description?: string }) {
    // create transaction and update user balance atomically
    const { userId, amount, description } = tx;
    // ensure user exists
    const existing = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!existing) throw new NotFoundException('User not found');

    return this.prisma.$transaction(async (prisma) => {
      const transaction = await prisma.transaction.create({
        data: { userId, amount: Math.round(amount), description },
      });

      await prisma.user.update({
        where: { id: userId },
        data: { balance: { increment: Math.round(amount) } },
      });

      return transaction;
    });
  }

  async findAll() {
    return this.prisma.transaction.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' } });
  }
}
