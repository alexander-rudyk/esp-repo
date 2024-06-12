import { DataSource } from 'typeorm';
import { ProjectSettingsModel } from '../entities/settings.entity';

export const settingsProviders = [
  {
    provide: 'SETTINGS_REPO',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProjectSettingsModel),
    inject: ['DATA_SOURCE'],
  },
];
