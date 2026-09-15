import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('lessons/:lessonId/complete')
  completeLesson(
    @CurrentUser('id') userId: string,
    @Param('lessonId') lessonId: string,
  ) {
    return this.progressService.completeLesson(userId, lessonId);
  }

  @Get('courses/:courseId')
  getCourseProgress(
    @CurrentUser('id') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.progressService.getCourseProgress(userId, courseId);
  }

  @Get('lessons/:lessonId')
  getLessonProgress(
    @CurrentUser('id') userId: string,
    @Param('lessonId') lessonId: string,
  ) {
    return this.progressService.getLessonProgress(userId, lessonId);
  }
}
