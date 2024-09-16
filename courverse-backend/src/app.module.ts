import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CertificatesModule } from './certificates/certificates.module';
import { ChallengesModule } from './challenges/challenges.module';
import { CoursesModule } from './courses/courses.module';
import { DatabaseModule } from './database/database.module';
import { LoggingService } from './logging/logging.service';
import { MonitoringModule } from './monitoring/monitoring.module';
import { NotificationsModule } from './notifications/notifications.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { RewardsModule } from './rewards/rewards.module';
import { UsersModule } from './users/users.module';
import { WebsocketsModule } from './websockets/websockets.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    CoursesModule,
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
