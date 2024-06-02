import { Module } from '@nestjs/common';
import { ProjectModule } from './project/project.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RightsModule } from './rights/rights.module';
import { FilesModule } from './files/files.module';
import typeorm from './config/typeorm';

@Module({
  imports: [
    MulterModule.register({}),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
      envFilePath: '.env',
    }),
    DatabaseModule,
    ProjectModule,
    AuthModule,
    UsersModule,
    RightsModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
