import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

export const getConfig = () => {
  return {
    type: 'postgres',
    host: `${process.env.POSTGRES_HOST}`,
    port: +process.env.POSTGRES_PORT,
    username: `${process.env.POSTGRES_USER}`,
    password: `${process.env.POSTGRES_PASSWORD}`,
    database: `${process.env.POSTGRES_DB}`,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    autoLoadEntities: true,
    synchronize: true,
    logging: true,
  } as DataSourceOptions;
};

export default registerAs('typeorm', () => getConfig());
