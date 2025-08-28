// creating dataSource to run the migration from CLI.
import { DatabaseConfig } from './database.config';
import { DataSource } from 'typeorm';

const dataSource = new DataSource(DatabaseConfig);

export default dataSource;
