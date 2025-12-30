import { Controller, Post, Get, Body, Param, BadRequestException } from '@nestjs/common';
import { AdminService } from './admin.service';
import * as bcrypt from 'bcryptjs';

interface CreateUserDto {
  username: string;
  password: string;
  role: 'user' | 'collection_point' | 'factory';
  name?: string;
  location?: string;
  balance?: number;
}

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('users')
  async createUser(@Body() dto: CreateUserDto) {
    if (!dto.username || !dto.password || !dto.role) {
      throw new BadRequestException('username, password, role required');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.adminService.createUser({
      username: dto.username,
      password: hashedPassword,
      role: dto.role,
      name: dto.name || `User: ${dto.username}`,
      location: dto.location || 'Unknown',
      balance: dto.balance || 0
    });
  }

  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    return this.adminService.getUser(id);
  }

  @Post('users/:id/balance')
  async updateBalance(
    @Param('id') id: string,
    @Body('amount') amount: number
  ) {
    if (typeof amount !== 'number') {
      throw new BadRequestException('amount must be a number');
    }
    return this.adminService.updateUserBalance(id, amount);
  }

  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }
}
