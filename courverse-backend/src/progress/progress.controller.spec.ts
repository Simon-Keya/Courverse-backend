import { Test, TestingModule } from '@nestjs/testing';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';

describe('ProgressController', () => {
  let progressController: ProgressController;
  let progressService: ProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgressController],
      providers: [
        {
          provide: ProgressService,
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

    progressController = module.get<ProgressController>(ProgressController);
    progressService = module.get<ProgressService>(ProgressService);
  });

  it('should be defined', () => {
    expect(progressController).toBeDefined();
  });

  describe('create', () => {
    it('should call ProgressService.create with correct parameters', async () => {
      const createProgressDto: CreateProgressDto = { courseId: 1, userId: 2 };
      await progressController.create(createProgressDto);
      expect(progressService.create).toHaveBeenCalledWith(createProgressDto);
    });
  });

  describe('findAll', () => {
    it('should call ProgressService.findAll', async () => {
      await progressController.findAll();
      expect(progressService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call ProgressService.findOne with correct parameters', async () => {
      const id = '1';
      await progressController.findOne(id);
      expect(progressService.findOne).toHaveBeenCalledWith(+id);
    });
  });

  describe('update', () => {
    it('should call ProgressService.update with correct parameters', async () => {
      const id = '1';
      const updateProgressDto: UpdateProgressDto = { progress: 80 };
      await progressController.update(id, updateProgressDto);
      expect(progressService.update).toHaveBeenCalledWith(+id, updateProgressDto);
    });
  });

  describe('remove', () => {
    it('should call ProgressService.remove with correct parameters', async () => {
      const id = '1';
      await progressController.remove(id);
      expect(progressService.remove).toHaveBeenCalledWith(+id);
    });
  });
});
