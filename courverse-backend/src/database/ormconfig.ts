import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'; // Ensure the type is for Postgres

export const ormConfig: PostgresConnectionOptions = {
  type: 'postgres', // Explicitly define the type
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'], // Optional: Include migration path
  synchronize: false, // Use migrations instead of synchronization
  migrationsRun: true, // Automatically run migrations
};
