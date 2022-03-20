import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty()
  @MinLength(2)
  @MaxLength(50)
  readonly name: string;

  @ApiProperty()
  @MinLength(2)
  @MaxLength(50)
  readonly surname: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly phone: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  readonly password: string;

  @ApiProperty()
  @IsOptional()
  readonly uid: string;

  @ApiProperty()
  @IsOptional()
  role: number;
}
