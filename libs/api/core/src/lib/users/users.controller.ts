import { Controller, Delete, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  create(user: CreateUserDto) {
    return this.usersService.create(user);
  }

  @Delete(':id')
  delete(id: string) {
    return this.usersService.delete(id);
  }
}
