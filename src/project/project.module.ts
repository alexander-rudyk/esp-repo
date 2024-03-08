import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { fileProviders } from './providers/file.provider';
import { projectProviders } from './providers/project.provider';
import { versionProviders } from './providers/version.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [ProjectController],
  imports: [DatabaseModule],
  providers: [
    ProjectService,
    ...fileProviders,
    ...projectProviders,
    ...versionProviders,
  ],
})
export class ProjectModule {}
