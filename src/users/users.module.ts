import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { userProviders } from './providers/user.provider';
import { DatabaseModule } from 'src/database/database.module';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, JwtModule],
  providers: [UsersService, ...userProviders],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
