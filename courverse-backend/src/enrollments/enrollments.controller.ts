import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Enrollments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @Roles(UserRole.LEARNER, UserRole.PUBLISHER, UserRole.ADMIN)
  enroll(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateEnrollmentDto,
  ) {
    return this.enrollmentsService.enroll(userId, dto);
  }

  @Get('me')
  @Roles(UserRole.LEARNER, UserRole.PUBLISHER, UserRole.ADMIN)
  myEnrollments(@CurrentUser('id') userId: string) {
    return this.enrollmentsService.findMyEnrollments(userId);
  }

  @Get('me/:courseId')
  @Roles(UserRole.LEARNER, UserRole.PUBLISHER, UserRole.ADMIN)
  getMyEnrollment(
    @CurrentUser('id') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.enrollmentsService.findOne(userId, courseId);
  }
}
