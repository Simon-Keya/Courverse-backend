import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

describe('AdminController', () => {
  let adminController: AdminController;
  let adminService: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
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

    adminController = module.get<AdminController>(AdminController);
    adminService = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(adminController).toBeDefined();
  });

  describe('create', () => {
    it('should call AdminService.create with correct parameters', async () => {
      // Providing all required properties from CreateAdminDto
      const createAdminDto: CreateAdminDto = {
        username: 'AdminUser',
        password: 'StrongPassword123',
        email: 'admin@example.com',
      };
      await adminController.create(createAdminDto);
      expect(adminService.create).toHaveBeenCalledWith(createAdminDto);
    });
  });

  describe('findAll', () => {
    it('should call AdminService.findAll', async () => {
      await adminController.findAll();
      expect(adminService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call AdminService.findOne with correct parameters', async () => {
      const id = 1; // Using a number here
      await adminController.findOne(id);
      expect(adminService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should call AdminService.update with correct parameters', async () => {
      const id = 1; // Using a number here
      // Providing actual properties from UpdateAdminDto
      const updateAdminDto: UpdateAdminDto = {
        username: 'UpdatedAdmin',
        email: 'updatedadmin@example.com',
      };
      await adminController.update(id, updateAdminDto);
      expect(adminService.update).toHaveBeenCalledWith(id, updateAdminDto);
    });
  });

  describe('remove', () => {
    it('should call AdminService.remove with correct parameters', async () => {
      const id = 1; // Using a number here
      await adminController.remove(id);
      expect(adminService.remove).toHaveBeenCalledWith(id);
    });
  });
});
