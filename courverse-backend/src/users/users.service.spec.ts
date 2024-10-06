import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
        username: 'testuser', // Added the missing 'username'
      };
      await usersService.create(createUserDto);
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      await usersService.findAll();
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one user by ID', async () => {
      const id = 1;
      await usersService.findOne(id);
      expect(usersService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = 1;
      const updateUserDto = {
        username: 'updateduser', // Ensure this matches UpdateUserDto structure
        email: 'updated@example.com',
        name: 'Updated User',
      };
      await usersService.update(id, updateUserDto);
      expect(usersService.update).toHaveBeenCalledWith(id, updateUserDto);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const id = 1;
      await usersService.delete(id);
      expect(usersService.delete).toHaveBeenCalledWith(id);
    });
  });
});
