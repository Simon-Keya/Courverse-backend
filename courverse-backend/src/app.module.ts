import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import TypeOrmModule
import { AuthModule } from './auth/auth.module';
import { CertificatesModule } from './certificates/certificates.module';
import { ChallengesModule } from './challenges/challenges.module';
import { CoursesModule } from './courses/courses.module';
import { DatabaseModule } from './database/database.module';
import { LoggingService } from './logging/logging.service';
import { MonitoringModule } from './monitoring/monitoring.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PublishersModule } from './publishers/publishers.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { RewardsModule } from './rewards/rewards.module';
import { User } from './users/entities/user.entity'; // Import User entity
import { UsersModule } from './users/users.module';
import { WebsocketsModule } from './websockets/websockets.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load environment variables
    TypeOrmModule.forRoot({
      type: 'postgres', // Database type
      host: process.env.DB_HOST, // Database host from env variables
      port: +process.env.DB_PORT, // Database port from env variables
      username: process.env.DB_USERNAME, // Database username from env variables
      password: process.env.DB_PASSWORD, // Database password from env variables
      database: process.env.DB_NAME, // Database name from env variables
      autoLoadEntities: true, // Automatically load entities from modules
      synchronize: process.env.NODE_ENV === 'development', // Synchronize only in development mode
      migrations: [__dirname + '/../migrations/*{.ts,.js}'], // Path to migration files
      migrationsRun: true, // Automatically run migrations on startup
    }),
    TypeOrmModule.forFeature([User]), // Make User entity available globally
    PublishersModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    PublishersModule,
    QuizzesModule,
    ChallengesModule,
    CertificatesModule,
    RewardsModule,
    NotificationsModule,
    WebsocketsModule,
    MonitoringModule,
  ],
  providers: [LoggingService],
})
export class AppModule {}
