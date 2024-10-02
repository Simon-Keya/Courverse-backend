import { Test, TestingModule } from '@nestjs/testing';
import { PublishersService } from './publishers.service';

describe('PublishersService', () => {
  let publishersService: PublishersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PublishersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    publishersService = module.get<PublishersService>(PublishersService);
  });

  it('should be defined', () => {
    expect(publishersService).toBeDefined();
  });

  describe('create', () => {
    it('should create a publisher', async () => {
      const createPublisherDto = { name: 'Test Publisher' };
      await publishersService.create(createPublisherDto);
      expect(publishersService.create).toHaveBeenCalledWith(createPublisherDto);
    });
  });

  describe('findAll', () => {
    it('should return all publishers', async () => {
      await publishersService.findAll();
      expect(publishersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one publisher by ID', async () => {
      const id = 1;
      await publishersService.findOne(id);
      expect(publishersService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a publisher', async () => {
      const id = 1;
      const updatePublisherDto = { name: 'Updated Publisher' };
      await publishersService.update(id, updatePublisherDto);
      expect(publishersService.update).toHaveBeenCalledWith(id, updatePublisherDto);
    });
  });

  describe('remove', () => {
    it('should remove a publisher', async () => {
      const id = 1;
      await publishersService.remove(id);
      expect(publishersService.remove).toHaveBeenCalledWith(id);
    });
  });
});
