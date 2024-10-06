import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'socket.io';
import { NotificationsGateway } from './gateway/notifications.gateway';

describe('NotificationsGateway', () => {
  let gateway: NotificationsGateway;
  let server: Server;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsGateway],
    }).compile();

    gateway = module.get<NotificationsGateway>(NotificationsGateway);

    // Mock WebSocketServer
    server = new Server();
    gateway.server = server; // Assign the mocked server to the gateway
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should handle a message event', () => {
    const data = { user: 'testUser', message: 'Hello, World!' };

    // Call the handleMessage method with just the data argument
    gateway.handleMessage(data);

    // Verify that the server emitted the correct message
    expect(gateway.server.emit).toHaveBeenCalledWith('message', data);
  });

  // Add more tests as needed
});
