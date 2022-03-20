import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordDTO {
  @IsString()
  readonly oldPassword: string;

  @MinLength(8)
  @MaxLength(128)
  @IsString()
  readonly newPassword: string;

  @MinLength(8)
  @MaxLength(128)
  @IsString()
  readonly newPasswordRepeat: string;
}
