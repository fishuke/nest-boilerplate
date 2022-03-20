import { IsOptional } from 'class-validator';

export class UpdateMeDTO {
  @IsOptional()
  readonly name: string;

  @IsOptional()
  readonly surname: string;

  @IsOptional()
  readonly email: string;
}
