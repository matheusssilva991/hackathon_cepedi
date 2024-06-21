import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Public } from '../../common/decorator/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { UserQueryDto } from './dto/user-query.dto';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  @Public()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('users')
  async findAll(@Query() query: UserQueryDto) {
    if (Object.keys(query).length) {
      return this.userService.findAllWithQuery(query);
    }
    return this.userService.findAll();
  }

  @Get('user/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(+id);
  }

  @Patch('user/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete('user/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(+id);
  }
}
