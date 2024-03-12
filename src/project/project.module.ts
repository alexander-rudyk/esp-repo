import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { projectProviders } from './providers/project.provider';
import { versionProviders } from './providers/version.provider';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { RightsModule } from 'src/rights/rights.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [ProjectController],
  imports: [
    DatabaseModule,
    ConfigModule,
    UsersModule,
    JwtModule,
    RightsModule,
    FilesModule,
  ],
  providers: [ProjectService, ...projectProviders, ...versionProviders],
})
export class ProjectModule {}
