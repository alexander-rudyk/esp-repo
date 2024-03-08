import { Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserCreateDto } from './dto/user.create.dto';

@Injectable()
export class UsersService {
  constructor(@Inject('USER_REPO') private userRepository: Repository<User>) {}

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(dto: UserCreateDto) {
    return this.userRepository.save(dto);
  }
}
