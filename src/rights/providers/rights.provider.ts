import { DataSource } from 'typeorm';
import { RightsModel } from '../entities/rights.entity';

export const rightsProviders = [
  {
    provide: 'RIGHTS_REPO',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RightsModel),
    inject: ['DATA_SOURCE'],
  },
];
