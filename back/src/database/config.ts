// TypeORM Data Source config for CLI (migrations)
// Usage: npx typeorm migration:generate -d src/database/config.ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';


dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'products',
    entities: ['src/entities/*.entity.ts'],
    migrations: ['src/database/migrations/*.ts'],
    synchronize: false,
});
