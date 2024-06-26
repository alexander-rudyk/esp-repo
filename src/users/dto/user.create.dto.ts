import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserCreateDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(3)
  firstName: string;

  @IsNotEmpty()
  @MinLength(3)
  lastName: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
