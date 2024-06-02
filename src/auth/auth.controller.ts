import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCreateDto } from 'src/users/dto/user.create.dto';
import { AuthGuard } from './auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Log In' })
  async signIn(@Body() dto: { email: string; password: string }) {
    return this.authService.signIn(dto.email, dto.password);
  }

  @Post('register')
  @ApiOperation({ summary: 'Create new user' })
  async signUp(@Body() dto: UserCreateDto) {
    return this.authService.signUp(dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get current user info' })
  async getProfile(@Request() req) {
    return req.user;
  }
}
