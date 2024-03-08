import { Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserCreateDto } from './dto/user.create.dto';

@Injectable()
export class UsersService {
  constructor(@Inject('USER_REPO') private userRepository: Repository<User>) {}

  async findByEmail(email: string, includePass: boolean = true) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!includePass) delete user.password;

    return user;
  }

  async findById(id: number, includePass: boolean = true) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!includePass) delete user.password;

    return user;
  }

  async createUser(dto: UserCreateDto) {
    return this.userRepository.save(dto);
  }
}
