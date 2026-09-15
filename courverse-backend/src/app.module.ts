import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { UsersModule } from './users/users.module';
import { WebsocketsModule } from './websockets/websockets.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { ProgressModule } from './progress/progress.module';
import { CategoriesModule } from './categories/categories.module';
import { SectionsModule } from './sections/sections.module';
import { LessonsModule } from './lessons/lessons.module';
import { WishlistModule } from './wishlist/wishlist.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +(process.env.DB_PORT || 5432),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'courverse',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),
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
    DatabaseModule,
    EnrollmentsModule,
    ProgressModule,
    CategoriesModule,
    SectionsModule,
    LessonsModule,
    WishlistModule,
  ],
  providers: [LoggingService],
})
export class AppModule {}
