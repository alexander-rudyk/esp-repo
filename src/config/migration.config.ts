import { DataSource } from 'typeorm';
import { getConfig } from './typeorm';

const datasource = new DataSource(getConfig());
datasource.initialize();
export default datasource;
