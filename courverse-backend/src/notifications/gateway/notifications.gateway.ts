import { forwardRef, Inject } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from '../notifications.service';

@WebSocketGateway({ cors: true })
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService, // Inject NotificationsService
  ) {}

  // Handles when a client connects to the WebSocket
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // Handles when a client disconnects from the WebSocket
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Sends a global notification to all clients
  sendNotification(notification: any) {
    this.server.emit('notification', notification);
  }

  // Handles an incoming message from the client
  handleMessage(data: { user: string; message: string }) {
    console.log(`Message from ${data.user}: ${data.message}`);
    this.server.emit('message', data); // Emit the message to all connected clients
  }
}
