import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';

describe('CoursesService', () => {
  let coursesService: CoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    coursesService = module.get<CoursesService>(CoursesService);
  });

  it('should be defined', () => {
    expect(coursesService).toBeDefined();
  });

  describe('create', () => {
    it('should create a course', async () => {
      const createCourseDto = { title: 'New Course', description: 'Course description' };
      await coursesService.create(createCourseDto);
      expect(coursesService.create).toHaveBeenCalledWith(createCourseDto);
    });
  });

  describe('findAll', () => {
    it('should return all courses', async () => {
      await coursesService.findAll();
      expect(coursesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one course by ID', async () => {
      const id = 1;
      await coursesService.findOne(id);
      expect(coursesService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a course', async () => {
      const id = 1;
      const updateCourseDto = { title: 'Updated Course' };
      await coursesService.update(id, updateCourseDto);
      expect(coursesService.update).toHaveBeenCalledWith(id, updateCourseDto);
    });
  });

  describe('remove', () => {
    it('should remove a course', async () => {
      const id = 1;
      await coursesService.remove(id);
      expect(coursesService.remove).toHaveBeenCalledWith(id);
    });
  });
});
