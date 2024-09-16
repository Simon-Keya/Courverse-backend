import { Module } from '@nestjs/common';
import { NotificationsGateway } from './gateway/notifications.gateway';
import { NotificationsService } from './notifications.service';

@Module({
  providers: [NotificationsGateway, NotificationsService],
  exports: [NotificationsGateway],
})
export class NotificationsModule {}
