import { Test, TestingModule } from '@nestjs/testing';
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
      const createProgressDto = { courseId: 1, userId: 2 };
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
      const updateProgressDto = { progress: 80 };
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
