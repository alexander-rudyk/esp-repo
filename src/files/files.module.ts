import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { fileProviders } from './providers/file.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [FilesService, ...fileProviders],
  exports: [FilesService],
})
export class FilesModule {}
