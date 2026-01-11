import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class MaterialPricesService {
  constructor(private prisma: PrismaService) {}

  async getPrices(userId?: string, role?: UserRole) {
    if (userId) {
      // User-specific prices
      const userPrices = await this.prisma.materialPrice.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      if (userPrices.length > 0) {
        return userPrices;
      }
    }

    // Global prices for role
    if (role) {
      const rolePrices = await this.prisma.materialPrice.findMany({
        where: { role, userId: null },
        orderBy: { createdAt: 'desc' },
      });
      if (rolePrices.length > 0) {
        return rolePrices;
      }
    }

    // Default empty
    return [];
  }

  async savePrices(prices: Array<{ material: string; price: number }>, userId?: string, role?: UserRole) {
    // Delete old prices
    if (userId) {
      await this.prisma.materialPrice.deleteMany({
        where: { userId },
      });
    } else if (role) {
      await this.prisma.materialPrice.deleteMany({
        where: { role, userId: null },
      });
    }

    // Create new prices
    const created = await Promise.all(
      prices.map((p) =>
        this.prisma.materialPrice.create({
          data: {
            material: p.material,
            price: p.price,
            userId: userId || null,
            role: role || null,
          },
        })
      )
    );

    return created;
  }

  async getPriceByMaterial(material: string, userId?: string, role?: UserRole): Promise<number | null> {
    const materialLower = material.toLowerCase();
    
    if (userId) {
      const userPrices = await this.prisma.materialPrice.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      const userPrice = userPrices.find(p => p.material.toLowerCase() === materialLower);
      if (userPrice) {
        return userPrice.price;
      }
    }

    if (role) {
      const rolePrices = await this.prisma.materialPrice.findMany({
        where: { role, userId: null },
        orderBy: { createdAt: 'desc' },
      });
      const rolePrice = rolePrices.find(p => p.material.toLowerCase() === materialLower);
      if (rolePrice) {
        return rolePrice.price;
      }
    }

    return null;
  }
}
