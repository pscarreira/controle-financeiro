import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/createUser.dto';
import { UserService } from './user.service';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { SelfDeleteGuard } from 'src/common/guards/self-delete.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() user: CreateUserDTO) {
    const result = await this.userService.createUser(user);
    return result;
  }

  @Get()
  async searchUser(@Query('search') search: string) {
    const result = await this.userService.findUserByEmailOrUsername(search);
    return result;
  }

  @Delete(':id')
  @UseGuards(SelfDeleteGuard)
  async deleteUser(@Param('id', ParseIntPipe) id: string) {
    const result = await this.userService.deleteUser(parseInt(id));
    return result;
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: string,
    @Body() user: UpdateUserDTO,
  ) {
    const result = await this.userService.updateUser(parseInt(id), user);
    return result;
  }
}
