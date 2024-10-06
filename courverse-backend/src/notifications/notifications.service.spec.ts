import { Test, TestingModule } from '@nestjs/testing';
import { Server, Socket } from 'socket.io';
import { NotificationsGateway } from './gateway/notifications.gateway';
import { NotificationsService } from './notifications.service';

describe('NotificationsGateway', () => {
  let notificationsGateway: NotificationsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsGateway,
        {
          provide: NotificationsService,
          useValue: {}, // Mock your NotificationsService methods here if needed
        },
      ],
    }).compile();

    notificationsGateway = module.get<NotificationsGateway>(NotificationsGateway);
  });

  it('should be defined', () => {
    expect(notificationsGateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should log client connection', () => {
      const client: Socket = { id: '12345' } as Socket;
      const consoleLogSpy = jest.spyOn(console, 'log');
      notificationsGateway.handleConnection(client);
      expect(consoleLogSpy).toHaveBeenCalledWith('Client connected: 12345');
    });
  });

  describe('handleDisconnect', () => {
    it('should log client disconnection', () => {
      const client: Socket = { id: '12345' } as Socket;
      const consoleLogSpy = jest.spyOn(console, 'log');
      notificationsGateway.handleDisconnect(client);
      expect(consoleLogSpy).toHaveBeenCalledWith('Client disconnected: 12345');
    });
  });

  describe('sendNotification', () => {
    it('should emit a notification', () => {
      const mockEmit = jest.fn();
      notificationsGateway.server = { emit: mockEmit } as unknown as Server;

      const notification = { message: 'Test notification' };
      notificationsGateway.sendNotification(notification);
      expect(mockEmit).toHaveBeenCalledWith('notification', notification);
    });
  });
});
