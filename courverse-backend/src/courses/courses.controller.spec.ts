import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

describe('CoursesController', () => {
  let coursesController: CoursesController;
  let coursesService: CoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        {
          provide: CoursesService,
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

    coursesController = module.get<CoursesController>(CoursesController);
    coursesService = module.get<CoursesService>(CoursesService);
  });

  it('should be defined', () => {
    expect(coursesController).toBeDefined();
  });

  describe('create', () => {
    it('should call CoursesService.create with correct parameters', async () => {
      const createCourseDto: CreateCourseDto = {
        title: 'New Course',
        description: 'Course description',
      };
      await coursesController.create(createCourseDto);
      expect(coursesService.create).toHaveBeenCalledWith(createCourseDto);
    });
  });

  describe('findAll', () => {
    it('should call CoursesService.findAll', async () => {
      await coursesController.findAll();
      expect(coursesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call CoursesService.findOne with correct parameters', async () => {
      const id = 1; // Change id from string to number
      await coursesController.findOne(id);
      expect(coursesService.findOne).toHaveBeenCalledWith(id); // No need for +id
    });
  });

  describe('update', () => {
    it('should call CoursesService.update with correct parameters', async () => {
      const id = 1; // Change id from string to number
      const updateCourseDto: UpdateCourseDto = { title: 'Updated Course' };
      await coursesController.update(id, updateCourseDto);
      expect(coursesService.update).toHaveBeenCalledWith(id, updateCourseDto); // No need for +id
    });
  });

  describe('remove', () => {
    it('should call CoursesService.remove with correct parameters', async () => {
      const id = 1; // Change id from string to number
      await coursesController.remove(id);
      expect(coursesService.remove).toHaveBeenCalledWith(id); // No need for +id
    });
  });
});
