import { Test, TestingModule } from '@nestjs/testing';
import { QuizzesService } from './quizzes.service';

describe('QuizzesService', () => {
  let quizzesService: QuizzesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: QuizzesService,
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

    quizzesService = module.get<QuizzesService>(QuizzesService);
  });

  it('should be defined', () => {
    expect(quizzesService).toBeDefined();
  });

  describe('create', () => {
    it('should create a quiz', async () => {
      const createQuizDto = { title: 'New Quiz', description: 'Quiz description' };
      await quizzesService.create(createQuizDto);
      expect(quizzesService.create).toHaveBeenCalledWith(createQuizDto);
    });
  });

  describe('findAll', () => {
    it('should return all quizzes', async () => {
      await quizzesService.findAll();
      expect(quizzesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one quiz by ID', async () => {
      const id = 1;
      await quizzesService.findOne(id);
      expect(quizzesService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a quiz', async () => {
      const id = 1;
      const updateQuizDto = { title: 'Updated Quiz' };
      await quizzesService.update(id, updateQuizDto);
      expect(quizzesService.update).toHaveBeenCalledWith(id, updateQuizDto);
    });
  });

  describe('remove', () => {
    it('should remove a quiz', async () => {
      const id = 1;
      await quizzesService.remove(id);
      expect(quizzesService.remove).toHaveBeenCalledWith(id);
    });
  });
});
