import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'socket.io';
import { NotificationsGateway } from './gateway/notifications.gateway';
import { NotificationsService } from './notifications.service';

describe('NotificationsGateway', () => {
  let gateway: NotificationsGateway;
  let server: Server;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsGateway,
        {
          provide: NotificationsService, // Mock NotificationsService dependency
          useValue: {
            sendGlobalNotification: jest.fn(), // Mock method if required
          },
        },
      ],
    }).compile();

    gateway = module.get<NotificationsGateway>(NotificationsGateway);
    // No need to assign notificationsService if it's not being used
    // notificationsService = module.get<NotificationsService>(NotificationsService);

    // Mock WebSocketServer
    server = new Server();
    gateway.server = server; // Assign the mocked server to the gateway
    jest.spyOn(gateway.server, 'emit'); // Spy on the 'emit' method to verify calls
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should handle a message event', () => {
    const data = { user: 'testUser', message: 'Hello, World!' };

    // Call the handleMessage method with the data argument
    gateway.handleMessage(data);

    // Verify that the server emitted the correct message
    expect(gateway.server.emit).toHaveBeenCalledWith('message', data);
  });

  // Add more tests as needed
});
