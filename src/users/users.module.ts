import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { userProviders } from './providers/user.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService, ...userProviders],
  exports: [UsersService],
})
export class UsersModule {}
