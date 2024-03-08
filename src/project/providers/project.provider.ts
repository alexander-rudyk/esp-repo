import { DataSource } from 'typeorm';
import { ProjectModel } from '../entities/project.entity';

export const projectProviders = [
  {
    provide: 'PROJECT_REPO',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProjectModel),
    inject: ['DATA_SOURCE'],
  },
];
