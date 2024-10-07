import { Test, TestingModule } from '@nestjs/testing';
import { Server, Socket } from 'socket.io';
import { WebsocketsService } from './websockets.service';

describe('WebsocketsService', () => {
  let service: WebsocketsService;
  let mockServer: Server;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebsocketsService,
        {
          provide: 'SocketIoServer', // Adjust according to your DI setup
          useValue: new Server(), // Mock server instance
        },
      ],
    }).compile();

    service = module.get<WebsocketsService>(WebsocketsService);
    mockServer = module.get<Server>('SocketIoServer'); // Get the mocked server
    service.server = mockServer;
    jest.spyOn(service.server, 'emit'); // Spy on the 'emit' method to verify calls
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
        'Welcome to the WebSocket server!',
      );
    });
  });

  // Make sure to handle disconnection and other functionalities accordingly
});
