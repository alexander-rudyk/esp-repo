import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCreateDto } from 'src/users/dto/user.create.dto';
import { AuthGuard } from './auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserUpdateDto } from 'src/users/dto/user.update.dto';
import { UsersService } from 'src/users/users.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

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

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put('profile')
  @ApiOperation({ summary: 'Update user info' })
  async updateProfile(@Body() dto: UserUpdateDto, @Request() req) {
    if (dto.password) await this.authService.updatePassword(dto);

    return this.usersService.updateUser(req.user, dto);
  }
}
