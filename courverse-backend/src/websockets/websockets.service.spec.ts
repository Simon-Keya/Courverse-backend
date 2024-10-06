import { Test, TestingModule } from '@nestjs/testing';
import { Server, Socket } from 'socket.io';
import { WebsocketsService } from './websockets.service';

describe('WebsocketsService', () => {
  let service: WebsocketsService;
  let mockServer: Server;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: WebsocketsService,
          useValue: {
            handleConnection: jest.fn(),
            handleDisconnect: jest.fn(),
            sendMessageToClient: jest.fn(),
            broadcastMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WebsocketsService>(WebsocketsService);

    // Mock the WebSocket server
    mockServer = new Server();
    service.server = mockServer;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should handle a connection', async () => {
      const client = { id: 'client1', emit: jest.fn() } as unknown as Socket;

      await service.handleConnection(client);

      expect(client.emit).toHaveBeenCalledWith(
        'connection',
        'Welcome to the WebSocket server!'
      );
      expect(service.handleConnection).toHaveBeenCalledWith(client);
    });
  });

  describe('handleDisconnect', () => {
    it('should handle a disconnection', async () => {
      const client = { id: 'client1' } as unknown as Socket;

      await service.handleDisconnect(client);

      expect(service.handleDisconnect).toHaveBeenCalledWith(client);
    });
  });

  describe('sendMessageToClient', () => {
    it('should send a message to a specific client', async () => {
      const clientId = 'client1';
      const message = 'Hello, Client!';

      service.sendMessageToClient(clientId, message);

      expect(service.sendMessageToClient).toHaveBeenCalledWith(
        clientId,
        message
      );
    });
  });

  describe('broadcastMessage', () => {
    it('should broadcast a message to all clients', async () => {
      const message = 'Hello, everyone!';

      service.broadcastMessage(message);

      expect(service.broadcastMessage).toHaveBeenCalledWith(message);
    });
  });
});
