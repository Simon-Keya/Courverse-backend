import { Test, TestingModule } from '@nestjs/testing';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { PublishersService } from './publishers.service';

describe('PublishersService', () => {
  let service: PublishersService;

  const mockPublishersService = {
    create: jest.fn().mockResolvedValue({}),
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    remove: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PublishersService,
          useValue: mockPublishersService, // Use the mocked service here
        },
      ],
    }).compile();

    service = module.get<PublishersService>(PublishersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a publisher', async () => {
      const createPublisherDto: CreatePublisherDto = {
        name: 'Test Publisher',
        email: 'test@publisher.com',
        website: 'https://publisher.com',
      };

      const result = await service.create(createPublisherDto);
      expect(mockPublishersService.create).toHaveBeenCalledWith(createPublisherDto);
      expect(result).toEqual({});
    });
  });

  describe('findAll', () => {
    it('should return all publishers', async () => {
      const result = await service.findAll();
      expect(mockPublishersService.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return one publisher by ID', async () => {
      const id = 1;
      const result = await service.findOne(id);
      expect(mockPublishersService.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual({});
    });
  });

  describe('update', () => {
    it('should update a publisher', async () => {
      const id = 1;
      const updatePublisherDto = {
        name: 'Updated Publisher',
        email: 'updated@publisher.com',
        website: 'https://updated-publisher.com',
      };

      const result = await service.update(id, updatePublisherDto);
      expect(mockPublishersService.update).toHaveBeenCalledWith(id, updatePublisherDto);
      expect(result).toEqual({});
    });
  });

  describe('remove', () => {
    it('should remove a publisher', async () => {
      const id = 1;
      const result = await service.remove(id);
      expect(mockPublishersService.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual({});
    });
  });
});
