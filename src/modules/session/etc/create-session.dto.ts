import { IsString } from 'class-validator';

export class CreateSessionDTO {
  @IsString()
  readonly phone: string;

  @IsString()
  readonly password: string;
}
