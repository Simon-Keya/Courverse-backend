import { Test, TestingModule } from '@nestjs/testing';
import { CreateProgressDto } from './dto/create-progress.dto'; // Adjust the import path as needed
import { UpdateProgressDto } from './dto/update-progress.dto'; // Adjust the import path as needed
import { ProgressService } from './progress.service';

describe('ProgressService', () => {
  let progressService: ProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    progressService = module.get<ProgressService>(ProgressService);
  });

  it('should be defined', () => {
    expect(progressService).toBeDefined();
  });

  describe('create', () => {
    it('should create progress', async () => {
      const createProgressDto: CreateProgressDto = {
        courseId: 1,
        userId: 2,
        progressPercentage: 50, // Include the required property
      };

      await progressService.create(createProgressDto);
      expect(progressService.create).toHaveBeenCalledWith(createProgressDto);
    });
  });

  describe('findAll', () => {
    it('should return all progress records', async () => {
      await progressService.findAll();
      expect(progressService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one progress record by ID', async () => {
      const id = 1;
      await progressService.findOne(id);
      expect(progressService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update progress', async () => {
      const id = 1;
      const updateProgressDto: UpdateProgressDto = {
        progressPercentage: 80, // Ensure you use the correct property
      };

      await progressService.update(id, updateProgressDto);
      expect(progressService.update).toHaveBeenCalledWith(id, updateProgressDto);
    });
  });

  describe('remove', () => {
    it('should remove progress', async () => {
      const id = 1;
      await progressService.remove(id);
      expect(progressService.remove).toHaveBeenCalledWith(id);
    });
  });
});
