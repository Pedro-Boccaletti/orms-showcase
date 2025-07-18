import { CreateUserDto as baseDto } from '@orms-showcase/domain';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto implements baseDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
