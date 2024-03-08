import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserCreateDto } from 'src/users/dto/user.create.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user)
      throw new HttpException(
        'Incorrect email or password',
        HttpStatus.UNAUTHORIZED,
      );

    if (!bcrypt.compare(user.password, password))
      throw new HttpException(
        'Incorrect email or password',
        HttpStatus.UNAUTHORIZED,
      );

    const payload = { sub: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(dto: UserCreateDto) {
    if (await this.userService.findByEmail(dto.email))
      throw new HttpException('Email already taken', HttpStatus.UNAUTHORIZED);

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    dto.password = await bcrypt.hash(dto.password, salt);

    const user = await this.userService.createUser(dto);

    const payload = { sub: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
