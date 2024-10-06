import { Logger } from '@nestjs/common';
/* eslint-disable prettier/prettier */
import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust this according to your CORS policy
  },
})
export class WebsocketsService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('WebsocketsService');

  // Handle WebSocket connection
  async handleConnection(client: Socket): Promise<void> {
    this.logger.log(`Client connected: ${client.id}`);
    // Optionally send a welcome message or initial data
    client.emit('connection', 'Welcome to the WebSocket server!');
  }

  // Handle WebSocket disconnection
  async handleDisconnect(client: Socket): Promise<void> {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Listen to a 'message' event
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: { user: string; message: string }): void {
    this.logger.log(`Message received from ${data.user}: ${data.message}`);
    // Broadcast the message to all connected clients
    this.server.emit('message', data);
  }

  // Custom event listener for 'customEvent'
  @SubscribeMessage('customEvent')
  handleCustomEvent(@MessageBody() data: any): void {
    this.logger.log(`Custom event received: ${JSON.stringify(data)}`);
    this.server.emit('customEventResponse', {
      message: 'Custom event processed successfully',
    });
  }

  // Send a message to a specific client
  sendMessageToClient(clientId: string, message: string): void {
    const client = this.server.sockets.sockets.get(clientId);
    if (client) {
      client.emit('message', { message });
    } else {
      this.logger.warn(`Client with ID ${clientId} not found`);
    }
  }

  // Broadcast to all connected clients
  broadcastMessage(message: string): void {
    this.server.emit('broadcast', { message });
  }
}
