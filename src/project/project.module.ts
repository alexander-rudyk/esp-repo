import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './services/project.service';
import { projectProviders } from './providers/project.provider';
import { versionProviders } from './providers/version.provider';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { RightsModule } from 'src/rights/rights.module';
import { FilesModule } from 'src/files/files.module';
import { settingsProviders } from './providers/settings.provider';
import { ProjectSettingsService } from './services/settings.service';

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
  providers: [
    ProjectService,
    ProjectSettingsService,
    ...projectProviders,
    ...versionProviders,
    ...settingsProviders,
  ],
})
export class ProjectModule {}
