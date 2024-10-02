import { Test, TestingModule } from '@nestjs/testing';
import { WebsocketsService } from './websockets.service';

describe('WebsocketsService', () => {
  let service: WebsocketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: WebsocketsService,
          useValue: {
            sendMessage: jest.fn(),
            handleConnection: jest.fn(),
            handleDisconnect: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WebsocketsService>(WebsocketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should send a message', async () => {
      const message = 'Hello World';
      await service.sendMessage(message);
      expect(service.sendMessage).toHaveBeenCalledWith(message);
    });
  });

  describe('handleConnection', () => {
    it('should handle a connection', async () => {
      const client = { id: 'client1' };
      await service.handleConnection(client);
      expect(service.handleConnection).toHaveBeenCalledWith(client);
    });
  });

  describe('handleDisconnect', () => {
    it('should handle a disconnection', async () => {
      const client = { id: 'client1' };
      await service.handleDisconnect(client);
      expect(service.handleDisconnect).toHaveBeenCalledWith(client);
    });
  });
});
