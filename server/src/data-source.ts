import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456789',
  database: 'inplace',
  synchronize: true,
  logging: false,
  entities: ['src/entities/**/*.ts'],
  migrations: [],
  subscribers: [],
});
