/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
/* eslint-enable prettier/prettier */
import { ApiTags } from '@nestjs/swagger';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { PublishersService } from './publishers.service';

@ApiTags('publishers')
@Controller('publishers')
export class PublishersController {
  constructor(private readonly publishersService: PublishersService) {}

  @Post()
  create(@Body() createPublisherDto: CreatePublisherDto) {
    return this.publishersService.create(createPublisherDto);
  }

  @Get()
  findAll() {
    return this.publishersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publishersService.findOne(parseInt(id, 10)); // Convert to number
  }

  @Patch(':id')
  update(
    @Param('id') id: string, // id is string initially
    @Body() updatePublisherDto: UpdatePublisherDto,
  ) {
    return this.publishersService.update(parseInt(id, 10), updatePublisherDto); // Convert to number
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publishersService.remove(parseInt(id, 10)); // Convert to number
  }
}
