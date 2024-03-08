import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';

export const userProviders = [
  {
    provide: 'USER_REPO',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
];
