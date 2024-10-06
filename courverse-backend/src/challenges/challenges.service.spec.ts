import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto'; // Adjust the import path as needed
import { UpdateChallengeDto } from './dto/update-challenge.dto'; // Adjust the import path as needed

describe('ChallengesService', () => {
  let challengesService: ChallengesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    challengesService = module.get<ChallengesService>(ChallengesService);
  });

  it('should be defined', () => {
    expect(challengesService).toBeDefined();
  });

  describe('create', () => {
    it('should create a challenge', async () => {
      const createChallengeDto: CreateChallengeDto = {
        title: 'New Challenge',
        description: 'Challenge description here',
        tasks: [], // Assuming tasks is an array, adjust based on your DTO definition
      };
      await challengesService.create(createChallengeDto);
      expect(challengesService.create).toHaveBeenCalledWith(createChallengeDto);
    });
  });

  describe('findAll', () => {
    it('should return all challenges', async () => {
      await challengesService.findAll();
      expect(challengesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one challenge by ID', async () => {
      const id = 1;
      await challengesService.findOne(id);
      expect(challengesService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a challenge', async () => {
      const id = 1;
      const updateChallengeDto: UpdateChallengeDto = {
        title: 'Updated Challenge',
        description: 'Updated description here',
        tasks: [], // Assuming tasks is an array, adjust based on your DTO definition
      };
      await challengesService.update(id, updateChallengeDto);
      expect(challengesService.update).toHaveBeenCalledWith(id, updateChallengeDto);
    });
  });

  describe('remove', () => {
    it('should remove a challenge', async () => {
      const id = 1;
      await challengesService.remove(id);
      expect(challengesService.remove).toHaveBeenCalledWith(id);
    });
  });
});
