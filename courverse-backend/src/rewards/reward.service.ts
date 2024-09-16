import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { Reward } from './entities/reward.entity';

@Injectable()
export class RewardsService {
  constructor(
    @InjectRepository(Reward)
    private readonly rewardRepository: Repository<Reward>,
  ) {}

  create(createRewardDto: CreateRewardDto): Promise<Reward> {
    const reward = this.rewardRepository.create(createRewardDto);
    return this.rewardRepository.save(reward);
  }

  findAll(): Promise<Reward[]> {
    return this.rewardRepository.find();
  }

  async findOne(id: number): Promise<Reward> {
    const reward = await this.rewardRepository.findOne(id);
    if (!reward) {
      throw new NotFoundException(`Reward with ID ${id} not found`);
    }
    return reward;
  }

  async update(id: number, updateRewardDto: UpdateRewardDto): Promise<Reward> {
    const reward = await this.findOne(id);
    Object.assign(reward, updateRewardDto);
    return this.rewardRepository.save(reward);
  }

  async remove(id: number): Promise<void> {
    const reward = await this.findOne(id);
    await this.rewardRepository.remove(reward);
  }
}
