import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { fileProviders } from './providers/file.provider';
import { projectProviders } from './providers/project.provider';
import { versionProviders } from './providers/version.provider';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { rightsProviders } from './providers/rights.provider';

@Module({
  controllers: [ProjectController],
  imports: [DatabaseModule, ConfigModule, UsersModule, JwtModule],
  providers: [
    ProjectService,
    ...fileProviders,
    ...projectProviders,
    ...versionProviders,
    ...rightsProviders,
  ],
})
export class ProjectModule {}
