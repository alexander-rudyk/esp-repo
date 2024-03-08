import { DataSource } from 'typeorm';
import { FileModel } from '../entities/file.entity';

export const fileProviders = [
  {
    provide: 'FILE_REPO',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(FileModel),
    inject: ['DATA_SOURCE'],
  },
];
