import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { Progress } from './entities/progress.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private readonly progressRepository: Repository<Progress>,
  ) {}

  create(createProgressDto: CreateProgressDto): Promise<Progress> {
    const progress = this.progressRepository.create(createProgressDto);
    return this.progressRepository.save(progress);
  }

  findAll(): Promise<Progress[]> {
    return this.progressRepository.find();
  }

  async findOne(id: number): Promise<Progress> {
    const progress = await this.progressRepository.findOne({ where: { id } });
    if (!progress) {
      throw new NotFoundException(`Progress with ID ${id} not found`);
    }
    return progress;
  }

  async update(
    id: number,
    updateProgressDto: UpdateProgressDto,
  ): Promise<Progress> {
    const progress = await this.findOne(id);
    Object.assign(progress, updateProgressDto);
    return this.progressRepository.save(progress);
  }

  async remove(id: number): Promise<void> {
    const progress = await this.findOne(id);
    await this.progressRepository.remove(progress);
  }
}
