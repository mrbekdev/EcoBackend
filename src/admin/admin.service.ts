import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: {
    username: string;
    password: string;
    role: 'user' | 'collection_point' | 'factory';
    name: string;
    location: string;
    balance: number;
  }) {
    return this.prisma.user.create({
      data: {
        username: data.username,
        password: data.password,
        role: data.role,
        name: data.name,
        location: data.location,
        balance: data.balance
      }
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        name: true,
        location: true,
        balance: true,
        createdAt: true
      }
    });
  }

  async getUser(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        role: true,
        name: true,
        location: true,
        balance: true,
        createdAt: true
      }
    });
  }

  async updateUserBalance(id: string, amount: number) {
    return this.prisma.user.update({
      where: { id },
      data: { balance: amount }
    });
  }

  async getStats() {
    const totalUsers = await this.prisma.user.count();
    const usersByRole = await this.prisma.user.groupBy({
      by: ['role'],
      _count: true
    });

    const totalBalance = await this.prisma.user.aggregate({
      _sum: { balance: true }
    });

    const totalWaste = await this.prisma.wasteReport.aggregate({
      _sum: { estimatedWeight: true }
    });

    const totalTransactions = await this.prisma.transaction.count();

    return {
      totalUsers,
      usersByRole,
      totalBalance: totalBalance._sum.balance || 0,
      totalWaste: totalWaste._sum.estimatedWeight || 0,
      totalTransactions
    };
  }
}
