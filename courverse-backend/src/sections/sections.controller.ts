import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SectionsService } from './sections.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';
import { IsString, MinLength } from 'class-validator';

class CreateSectionDto {
  @IsString()
  @MinLength(1)
  title: string;
}

class UpdateSectionDto {
  @IsString()
  @MinLength(1)
  title: string;
}

@ApiTags('sections')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PUBLISHER, UserRole.ADMIN)
@Controller()
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post('courses/:courseId/sections')
  create(
    @Param('courseId') courseId: string,
    @Body() dto: CreateSectionDto,
    @CurrentUser() user: any,
  ) {
    return this.sectionsService.create(courseId, dto.title, user);
  }

  @Patch('sections/:id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSectionDto,
    @CurrentUser() user: any,
  ) {
    return this.sectionsService.update(id, dto, user);
  }

  @Delete('sections/:id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.sectionsService.remove(id, user);
  }
}
