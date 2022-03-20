import {
  Delete,
  Get,
  Post,
  Put,
  Body,
  Controller,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UpdatePasswordDTO } from './etc/update-password.dto';
import { UpdateUserDTO } from './etc/update-user.dto';
import { CreateUserDTO } from './etc/create-user.dto';
import { User } from '@decorators/user.decorator';
import { UpdateMeDTO } from './etc/update-me.dto';
import { RoleTypes } from '@enums/roles.enum';
import { UserService } from './user.service';
import { JwtGuard } from '@guards/jwt.guard';
import { AuthSkip } from '@guards/auth-skip.guard';
import { RolesGuard } from '@guards/roles.guard';
import { Roles } from '@decorators/roles.decorator';
import { Throttle } from '@nestjs/throttler';

@UseGuards(JwtGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Throttle(1, 60 * 10)
  @UseGuards(AuthSkip)
  @Post()
  async create(@Body() createDTO: CreateUserDTO) {
    return await this.userService.create(createDTO);
  }

  @Roles(RoleTypes.USER, RoleTypes.ADMIN)
  @Get('@me')
  async getMe(@User() user) {
    return await this.userService.getMe(user);
  }

  @Roles(RoleTypes.USER, RoleTypes.ADMIN)
  @Put('@me')
  async updateMe(@User() user, @Body() updateDTO: UpdateMeDTO) {
    return await this.userService.updateMe(user._id, updateDTO);
  }

  @Roles(RoleTypes.USER, RoleTypes.ADMIN)
  @Put('@me/password')
  async updateMyPassword(@User() user, @Body() updateDTO: UpdatePasswordDTO) {
    return await this.userService.updateMyPassword(user, updateDTO);
  }

  /**
   * ADMIN ROUTES
   **/

  @Roles(RoleTypes.ADMIN)
  @Get()
  async getAll(@Query('index') index?: number) {
    return await this.userService.getAll(index);
  }

  @Roles(RoleTypes.ADMIN)
  @Get(':id')
  async getByID(@Param('id') id: string) {
    return await this.userService.getByID(id);
  }

  @Roles(RoleTypes.ADMIN)
  @Put(':id')
  async updateByID(@Param() params, @Body() updateDTO: UpdateUserDTO) {
    return await this.userService.update(params.id, updateDTO);
  }

  @Roles(RoleTypes.ADMIN)
  @Delete(':id')
  async deleteByID(@Param() params) {
    return await this.userService.delete(params.id);
  }
}
