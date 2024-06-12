import { IsOptional, MinLength } from 'class-validator';

export class UserUpdateDto {
  @MinLength(3)
  @IsOptional()
  firstName?: string;

  @MinLength(3)
  @IsOptional()
  lastName?: string;

  @MinLength(8)
  @IsOptional()
  password?: string;
}
