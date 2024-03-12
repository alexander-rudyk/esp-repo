import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { rightsProviders } from './providers/rights.provider';
import { RightsService } from './rights.service';

@Module({
  imports: [DatabaseModule],
  providers: [RightsService, ...rightsProviders],
  exports: [RightsService],
})
export class RightsModule {}
