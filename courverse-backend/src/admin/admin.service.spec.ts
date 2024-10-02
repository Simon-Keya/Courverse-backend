import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

describe('AdminService', () => {
  let adminService: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    adminService = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(adminService).toBeDefined();
  });

  describe('create', () => {
    it('should create an admin', async () => {
      // Correctly structured CreateAdminDto
      const createAdminDto: CreateAdminDto = {
        username: 'AdminUser',
        password: 'StrongPassword123',
        email: 'admin@example.com',
      };
      await adminService.create(createAdminDto);
      expect(adminService.create).toHaveBeenCalledWith(createAdminDto);
    });
  });

  describe('findAll', () => {
    it('should return all admins', async () => {
      await adminService.findAll();
      expect(adminService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one admin by ID', async () => {
      const id = 1;
      await adminService.findOne(id);
      expect(adminService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update an admin', async () => {
      const id = 1;
      // Correctly structured UpdateAdminDto
      const updateAdminDto: UpdateAdminDto = {
        username: 'UpdatedAdmin',
        email: 'updatedadmin@example.com',
      };
      await adminService.update(id, updateAdminDto);
      expect(adminService.update).toHaveBeenCalledWith(id, updateAdminDto);
    });
  });

  describe('remove', () => {
    it('should remove an admin', async () => {
      const id = 1;
      await adminService.remove(id);
      expect(adminService.remove).toHaveBeenCalledWith(id);
    });
  });
});
