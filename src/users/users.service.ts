import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({ select: { id: true, username: true, role: true, balance: true, name: true, location: true, createdAt: true } });
  }

  // Return raw users including password for debugging (do not expose in production)
  async findAllRaw() {
    return this.prisma.user.findMany();
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id }, select: { id: true, username: true, role: true, balance: true, name: true, location: true, createdAt: true } });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async create(data: any) {
    return this.prisma.user.create({ data });
  }
}
