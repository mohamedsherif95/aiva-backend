import { join } from 'path';
import envKeys from './envKeys';
const migrationsDirPath = join(__dirname, '..', 'migrations/');


export const DatabaseConfig: any = {
  url: envKeys.DATABASE_URL,
  type: 'postgres',
  synchronize: false,
  logging: false,
  autoLoadEntities: true,
  entities: [__dirname + './../modules/**/entities/*.entity.{ts,js}'],
  migrations: [migrationsDirPath + '/*{.ts,.js}'],
  cli: {
    migrationsDir: migrationsDirPath,
  },
  ssl: {
    rejectUnauthorized: false, // Use SSL only in production
  },
};
