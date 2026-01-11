import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({ select: { id: true, username: true, role: true, balance: true, name: true, location: true, phone: true, companyName: true, createdAt: true } });
  }

  // Return raw users including password for debugging (do not expose in production)
  async findAllRaw() {
    return this.prisma.user.findMany();
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id }, select: { id: true, username: true, role: true, balance: true, name: true, location: true, phone: true, companyName: true, createdAt: true } });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async create(data: any) {
    return this.prisma.user.create({ data });
  }

  async updatePassword(id: string, hashedPassword: string) {
    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    });
  }

  async updateUser(id: string, data: any) {
    // Remove any undefined values
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );
    
    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: { 
        id: true, 
        username: true, 
        role: true, 
        balance: true, 
        name: true, 
        location: true, 
        phone: true,
        companyName: true,
        createdAt: true 
      }
    });
  }

  async isPhoneBlocked(phone: string): Promise<boolean> {
    const blocked = await this.prisma.blockedPhone.findUnique({
      where: { phone }
    });
    return !!blocked;
  }
}
