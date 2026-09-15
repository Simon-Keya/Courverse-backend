import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CourseDifficulty, CourseStatus } from './entities/course.entity';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PUBLISHER, UserRole.ADMIN)
  @ApiBearerAuth()
  create(
    @Body() createCourseDto: CreateCourseDto,
    @CurrentUser() user: any,
  ) {
    // For simplicity publisherId comes from DTO or linked publisher; in production resolve from user
    return this.coursesService.create(createCourseDto, user.id);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('publisherId') publisherId?: string,
    @Query('difficulty') difficulty?: CourseDifficulty,
    @Query('status') status?: CourseStatus,
    @Query('isFree') isFree?: string,
    @Query('sort') sort?: 'newest' | 'popular' | 'rating' | 'price_asc' | 'price_desc',
    @Query('includeAllStatuses') includeAllStatuses?: string,
  ) {
    return this.coursesService.findAll({
      page: page ? +page : 1,
      limit: limit ? +limit : 12,
      search,
      categoryId,
      publisherId,
      difficulty,
      status,
      isFree: isFree === 'true' ? true : isFree === 'false' ? false : undefined,
      sort,
      includeAllStatuses: includeAllStatuses === 'true',
    });
  }


  @Get('publisher/mine')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PUBLISHER, UserRole.ADMIN)
  @ApiBearerAuth()
  async myCourses(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: CourseStatus,
  ) {
    return this.coursesService.findMineForUser(user.id, {
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
      status,
      includeAllStatuses: !status,
    });
  }

  @Get('admin/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  pendingReview(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.coursesService.findPendingReview({
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.coursesService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PUBLISHER, UserRole.ADMIN)
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @CurrentUser() user: any,
  ) {
    return this.coursesService.update(id, updateCourseDto, user);
  }

  @Post(':id/submit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PUBLISHER, UserRole.ADMIN)
  @ApiBearerAuth()
  submit(@Param('id') id: string, @CurrentUser() user: any) {
    return this.coursesService.submitForReview(id, user);
  }

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  approve(@Param('id') id: string) {
    return this.coursesService.approve(id);
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.PUBLISHER)
  @ApiBearerAuth()
  publish(@Param('id') id: string) {
    return this.coursesService.publish(id);
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  reject(@Param('id') id: string) {
    return this.coursesService.reject(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PUBLISHER, UserRole.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.coursesService.remove(id, user);
  }
}
