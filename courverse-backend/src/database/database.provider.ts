import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'; // Ensure correct type is imported
import { ormConfig } from './ormconfig'; // Import the ormConfig

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (configService: ConfigService) => {
      const config: PostgresConnectionOptions = {
        ...ormConfig, // Spread the base ormConfig
        type: 'postgres', // Ensure 'postgres' type is explicitly defined
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
      };

      const dataSource = new DataSource(config); // Correctly assign config to DataSource
      return dataSource.initialize(); // Initialize and return the connection
    },
    inject: [ConfigService],
  },
];
