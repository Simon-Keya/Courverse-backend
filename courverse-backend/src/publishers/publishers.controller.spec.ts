import { Test, TestingModule } from '@nestjs/testing';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { PublishersController } from './publishers.controller';
import { PublishersService } from './publishers.service';

describe('PublishersController', () => {
  let publishersController: PublishersController;
  let publishersService: PublishersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublishersController],
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

    publishersController = module.get<PublishersController>(PublishersController);
    publishersService = module.get<PublishersService>(PublishersService);
  });

  it('should be defined', () => {
    expect(publishersController).toBeDefined();
  });

  describe('create', () => {
    it('should call PublishersService.create with correct parameters', async () => {
      const createPublisherDto: CreatePublisherDto = { name: 'Test Publisher' };
      await publishersController.create(createPublisherDto);
      expect(publishersService.create).toHaveBeenCalledWith(createPublisherDto);
    });
  });

  describe('findAll', () => {
    it('should call PublishersService.findAll', async () => {
      await publishersController.findAll();
      expect(publishersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call PublishersService.findOne with correct parameters', async () => {
      const id = '1';
      await publishersController.findOne(id);
      expect(publishersService.findOne).toHaveBeenCalledWith(+id);
    });
  });

  describe('update', () => {
    it('should call PublishersService.update with correct parameters', async () => {
      const id = '1';
      const updatePublisherDto: UpdatePublisherDto = { name: 'Updated Publisher' };
      await publishersController.update(id, updatePublisherDto);
      expect(publishersService.update).toHaveBeenCalledWith(+id, updatePublisherDto);
    });
  });

  describe('remove', () => {
    it('should call PublishersService.remove with correct parameters', async () => {
      const id = '1';
      await publishersController.remove(id);
      expect(publishersService.remove).toHaveBeenCalledWith(+id);
    });
  });
});
