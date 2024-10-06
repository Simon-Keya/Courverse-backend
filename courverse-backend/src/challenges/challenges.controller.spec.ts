import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

describe('ChallengesController', () => {
  let challengesController: ChallengesController;
  let challengesService: ChallengesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChallengesController],
      providers: [
        {
          provide: ChallengesService,
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

    challengesController = module.get<ChallengesController>(ChallengesController);
    challengesService = module.get<ChallengesService>(ChallengesService);
  });

  it('should be defined', () => {
    expect(challengesController).toBeDefined();
  });

  describe('create', () => {
    it('should call ChallengesService.create with correct parameters', async () => {
      const createChallengeDto: CreateChallengeDto = {
        title: 'New Challenge', // Use the correct property name
        description: 'Challenge description here', // Add all required properties
        tasks: [], // Assuming tasks is an array, adjust based on your DTO definition
      };
      await challengesController.create(createChallengeDto);
      expect(challengesService.create).toHaveBeenCalledWith(createChallengeDto);
    });
  });

  describe('findAll', () => {
    it('should call ChallengesService.findAll', async () => {
      await challengesController.findAll();
      expect(challengesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call ChallengesService.findOne with correct parameters', async () => {
      const id = 1; // Use a number instead of a string
      await challengesController.findOne(id);
      expect(challengesService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should call ChallengesService.update with correct parameters', async () => {
      const id = 1; // Use a number instead of a string
      const updateChallengeDto: UpdateChallengeDto = {
        title: 'Updated Challenge', // Use the correct property name
        description: 'Updated description here', // Add all required properties
        tasks: [], // Assuming tasks is an array, adjust based on your DTO definition
      };
      await challengesController.update(id, updateChallengeDto);
      expect(challengesService.update).toHaveBeenCalledWith(id, updateChallengeDto);
    });
  });

  describe('remove', () => {
    it('should call ChallengesService.remove with correct parameters', async () => {
      const id = 1; // Use a number instead of a string
      await challengesController.remove(id);
      expect(challengesService.remove).toHaveBeenCalledWith(id);
    });
  });
});
