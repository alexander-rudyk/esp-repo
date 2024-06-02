import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (configService: ConfigService) => {
      const dbConfig = configService.getOrThrow('typeorm');
      const dataSource = new DataSource(dbConfig);

      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
];
