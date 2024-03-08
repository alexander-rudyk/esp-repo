import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCreateDto } from 'src/users/dto/user.create.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async signIn(@Body() dto: { email: string; password: string }) {
    return this.authService.signIn(dto.email, dto.password);
  }

  @Post('register')
  async signUp(@Body() dto: UserCreateDto) {
    return this.authService.signUp(dto);
  }
}
