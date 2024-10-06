import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(), // Updated to delete
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('create', () => {
    it('should call UsersService.create with correct parameters', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        username: 'testuser', // Added required username field
      };
      await usersController.create(createUserDto);
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should call UsersService.findAll', async () => {
      await usersController.findAll();
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call UsersService.findOne with correct parameters', async () => {
      const id = '1';
      await usersController.findOne(+id); // Converted string to number
      expect(usersService.findOne).toHaveBeenCalledWith(+id);
    });
  });

  describe('update', () => {
    it('should call UsersService.update with correct parameters', async () => {
      const id = '1';
      const updateUserDto: UpdateUserDto = { username: 'UpdatedUser' }; // Using valid update data
      await usersController.update(+id, updateUserDto);
      expect(usersService.update).toHaveBeenCalledWith(+id, updateUserDto);
    });
  });

  describe('delete', () => {
    it('should call UsersService.delete with correct parameters', async () => {
      const id = '1';
      await usersController.delete(+id); // Converted string to number
      expect(usersService.delete).toHaveBeenCalledWith(+id);
    });
  });
});
