import { Body, Controller, Get, Post } from '@nestjs/common';

import { UserService } from './user.service';
import { User } from '../../schemas/user.schema';
import { CreateUserDto } from '../../dto/create-user.dto';
import { Public } from '../../guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getUsers(): Promise<User[]> {
    return await this.userService.getUsers();
  }

  @Post('/')
  @Public()
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(dto);
  }
}
