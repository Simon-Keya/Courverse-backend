import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('wishlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  list(@CurrentUser('id') userId: string) {
    return this.wishlistService.list(userId);
  }

  @Get(':courseId/status')
  status(
    @CurrentUser('id') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.wishlistService.has(userId, courseId);
  }

  @Post(':courseId')
  add(
    @CurrentUser('id') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.wishlistService.add(userId, courseId);
  }

  @Delete(':courseId')
  remove(
    @CurrentUser('id') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.wishlistService.remove(userId, courseId);
  }
}
