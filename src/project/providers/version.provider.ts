import { DataSource } from 'typeorm';
import { VersionModel } from '../entities/version.entity';

export const versionProviders = [
  {
    provide: 'VERSION_REPO',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(VersionModel),
    inject: ['DATA_SOURCE'],
  },
];
