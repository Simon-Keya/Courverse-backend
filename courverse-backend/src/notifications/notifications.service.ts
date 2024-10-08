import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { NotificationDto } from './dto/notification.dto';
import { NotificationsGateway } from './gateway/notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(forwardRef(() => NotificationsGateway))
    private readonly notificationsGateway: NotificationsGateway, // Inject NotificationsGateway
  ) {}

  // Sends a global notification using the WebSocket gateway
  sendGlobalNotification(notificationDto: NotificationDto): void {
    this.notificationsGateway.sendNotification(notificationDto);
  }
}
