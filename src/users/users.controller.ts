import { Body, Controller, Get, Param, Post, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Controller()
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private usersService: UsersService) {}

  @Post('auth/login')
  async login(@Body() body: LoginDto) {
    this.logger.log(`Login attempt for username=${body.username}`);
    const user = await this.usersService.findByUsername(body.username);
    if (!user) return { success: false, message: 'Invalid credentials' };

    this.logger.debug(`Found user: ${user.username} id=${(user as any).id} pwLen=${((user as any).password || '').length}`);

    const valid = await bcrypt.compare(body.password, (user as any).password || '');
    if (!valid) {
      this.logger.warn(`Invalid password for username=${body.username}`);
      return { success: false, message: 'Invalid credentials' };
    }

    const { password, ...rest } = user as any;
    const secret = process.env.JWT_SECRET || 'change-me';
    const token = jwt.sign({ sub: rest.id, username: rest.username, role: rest.role }, secret, { expiresIn: '8h' });

    this.logger.log(`Login success for username=${body.username}`);
    return { success: true, user: rest, token };
  }

  // Debug endpoint - shows full user records (including password hashes). Only enabled in non-production.
  @Get('debug/users')
  async debugUsers() {
    if (process.env.NODE_ENV === 'production') {
      return { message: 'Not allowed' };
    }
    const users = await this.usersService.findAllRaw();
    return users;
  }

  @Get('users')
  async findAll() {
    const users = await this.usersService.findAll();
    return users;
  }

  @Get('users/:id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post('users')
  async create(@Body() body: any) {
    // hash password if provided
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }
    return this.usersService.create(body);
  }
}
