import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@modules/user/etc/user.schema';
import { UserService } from '@user/user.service';
import { CreateSessionDTO } from './etc/create-session.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { FastifyRequest } from 'fastify';
import * as luxon from 'luxon';
import { RoleTypes } from '@enums/roles.enum';
import { config } from '@config';

@Injectable()
export class SessionService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async create(
    createDTO: CreateSessionDTO,
    request: FastifyRequest,
  ): Promise<string> {
    const user = await this.userService.getByPhoneNumber(createDTO.phone);

    if (request.headers.origin !== config.origin) {
      /**
       * If you have multiple clients for multiple roles
       * you can block users to create session from admin client
       */
      throw new UnauthorizedException();
    }

    if (!user)
      throw new NotFoundException('User not found with this phone number!');

    if (!(await bcrypt.compare(createDTO.password, user.password)))
      throw new UnauthorizedException('Password mismatch!');

    return this.jwtService.sign({
      iss: user._id,
      role: user.role,
      name: user.name,
      surname: user.surname,
      phone: user.phone,
    });
  }

  async verifyPayload({ exp, iss }: JwtPayload): Promise<User> {
    const timeDiff = exp - luxon.DateTime.local().toSeconds();

    if (timeDiff <= 0) throw new UnauthorizedException();

    const user = await this.userService.getByID(iss);

    if (!user) throw new UnauthorizedException();

    return user;
  }

  async createSessionForUser(id) {
    const user = await this.userService.getByID(id);

    return this.jwtService.sign({
      iss: user._id,
      role: user.role,
      name: user.name,
      surname: user.surname,
      phone: user.phone,
    });
  }
}
