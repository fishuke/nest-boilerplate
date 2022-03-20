import { IsOptional } from 'class-validator';
import { RoleTypes } from '@enums/roles.enum';

export class UpdateUserDTO {
  @IsOptional()
  name: string;

  @IsOptional()
  surname: string;

  @IsOptional()
  email: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  role: RoleTypes;

  @IsOptional()
  password: string;
}
