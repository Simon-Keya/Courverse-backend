import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { Publisher } from './entities/publisher.entity';

@Injectable()
export class PublishersService {
  constructor(
    @InjectRepository(Publisher)
    private readonly publisherRepository: Repository<Publisher>,
  ) {}

  create(createPublisherDto: CreatePublisherDto): Promise<Publisher> {
    const publisher = this.publisherRepository.create(createPublisherDto);
    return this.publisherRepository.save(publisher);
  }

  findAll(): Promise<Publisher[]> {
    return this.publisherRepository.find({ relations: ['courses'] });
  }

  async findOne(id: string): Promise<Publisher> {
    const publisher = await this.publisherRepository.findOne({
      where: { id },
      relations: ['courses'],
    });
    if (!publisher) {
      throw new NotFoundException(`Publisher with ID ${id} not found`);
    }
    return publisher;
  }

  async findByUserId(userId: string): Promise<Publisher | null> {
    return this.publisherRepository.findOne({ where: { userId } });
  }

  async findBySlug(slug: string): Promise<Publisher> {
    const publisher = await this.publisherRepository.findOne({
      where: { slug },
      relations: ['courses'],
    });
    if (!publisher) {
      throw new NotFoundException('Publisher not found');
    }
    return publisher;
  }

  async update(id: string, updatePublisherDto: UpdatePublisherDto): Promise<Publisher> {
    const publisher = await this.findOne(id);
    Object.assign(publisher, updatePublisherDto);
    return this.publisherRepository.save(publisher);
  }

  async remove(id: string): Promise<void> {
    const publisher = await this.findOne(id);
    await this.publisherRepository.remove(publisher);
  }
}
