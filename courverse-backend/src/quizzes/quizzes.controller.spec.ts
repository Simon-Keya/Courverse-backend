import { Test, TestingModule } from '@nestjs/testing';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';

describe('QuizzesController', () => {
  let quizzesController: QuizzesController;
  let quizzesService: QuizzesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizzesController],
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

    quizzesController = module.get<QuizzesController>(QuizzesController);
    quizzesService = module.get<QuizzesService>(QuizzesService);
  });

  it('should be defined', () => {
    expect(quizzesController).toBeDefined();
  });

  describe('create', () => {
    it('should call QuizzesService.create with correct parameters', async () => {
      const createQuizDto: CreateQuizDto = { title: 'New Quiz', description: 'Quiz description' };
      await quizzesController.create(createQuizDto);
      expect(quizzesService.create).toHaveBeenCalledWith(createQuizDto);
    });
  });

  describe('findAll', () => {
    it('should call QuizzesService.findAll', async () => {
      await quizzesController.findAll();
      expect(quizzesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call QuizzesService.findOne with correct parameters', async () => {
      const id = '1';
      await quizzesController.findOne(id);
      expect(quizzesService.findOne).toHaveBeenCalledWith(+id);
    });
  });

  describe('update', () => {
    it('should call QuizzesService.update with correct parameters', async () => {
      const id = '1';
      const updateQuizDto: UpdateQuizDto = { title: 'Updated Quiz' };
      await quizzesController.update(id, updateQuizDto);
      expect(quizzesService.update).toHaveBeenCalledWith(+id, updateQuizDto);
    });
  });

  describe('remove', () => {
    it('should call QuizzesService.remove with correct parameters', async () => {
      const id = '1';
      await quizzesController.remove(id);
      expect(quizzesService.remove).toHaveBeenCalledWith(+id);
    });
  });
});
