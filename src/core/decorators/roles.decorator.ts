import { SetMetadata } from '@nestjs/common';
import { RoleTypes } from '@enums/roles.enum';

// noinspection JSUnusedGlobalSymbols
export const Roles = (...roles: RoleTypes[]) => SetMetadata('roles', roles);
