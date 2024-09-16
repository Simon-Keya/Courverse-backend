import { Injectable } from '@nestjs/common';
import { NotificationDto } from './dto/notification.dto';
import { NotificationsGateway } from './gateway/notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  sendGlobalNotification(notificationDto: NotificationDto) {
    this.notificationsGateway.sendNotification(notificationDto);
  }
}
