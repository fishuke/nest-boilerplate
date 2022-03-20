import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleTypes } from '@enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles: RoleTypes[] = this.reflector.get<RoleTypes[]>(
      'roles',
      context.getHandler(),
    );

    if (!roles) return false;

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) return false;

    return roles.includes(user.role);
  }
}
