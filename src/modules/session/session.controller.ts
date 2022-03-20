import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDTO } from './etc/create-session.dto';
import { RolesGuard } from '@guards/roles.guard';
import { JwtGuard } from '@guards/jwt.guard';
import { Roles } from '@decorators/roles.decorator';
import { RoleTypes } from '@enums/roles.enum';
import { FastifyRequest } from 'fastify';
import { Throttle } from '@nestjs/throttler';

@Controller('session')
export class SessionController {
  constructor(private readonly service: SessionService) {}

  @Throttle(3, 60)
  @Post()
  async createSession(
    @Body() createDTO: CreateSessionDTO,
    @Req() request: FastifyRequest,
  ) {
    return await this.service.create(createDTO, request);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleTypes.ADMIN)
  @Post(':id')
  async createSessionForUser(@Param('id') id) {
    return await this.service.createSessionForUser(id);
  }
}
