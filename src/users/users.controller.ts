import { Body, Controller, Get, Param, Post, Put, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }
    return this.usersService.create(body);
  }

  @Put('users/:id/password')
  async changePassword(
    @Param('id') id: string,
    @Body() body: { currentPassword: string; newPassword: string }
  ) {
    try {
      const user = await this.usersService.findById(id);
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      const valid = await bcrypt.compare(body.currentPassword, (user as any).password);
      if (!valid) {
        return { success: false, message: 'Current password is incorrect' };
      }

      if (!body.newPassword || body.newPassword.length < 6) {
        return { success: false, message: 'New password must be at least 6 characters long' };
      }

      const hashedPassword = await bcrypt.hash(body.newPassword, 10);
      await this.usersService.updatePassword(id, hashedPassword);

      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      this.logger.error(`Error changing password for user ${id}:`, error);
      return { success: false, message: 'Failed to update password' };
    }
  }

  @Put('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    try {
      const updatedUser = await this.usersService.updateUser(id, updateUserDto);
      return {
        success: true,
        message: 'User updated successfully',
        user: updatedUser
      };
    } catch (error) {
      this.logger.error(`Error updating user ${id}:`, error);
      throw new Error('Failed to update user');
    }
  }
}
