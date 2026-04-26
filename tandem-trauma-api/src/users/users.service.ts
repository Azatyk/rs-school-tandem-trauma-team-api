import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getLeaderboard(page = 1, limit = 10) {
    const [data, total] = await this.usersRepository.findAndCount({
      select: ['id', 'name', 'xp', 'currentStreak'],
      order: { xp: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    const ranked = data.map((user, index) => ({
      rank: (page - 1) * limit + index + 1,
      id: user.id,
      name: user.name,
      xp: user.xp,
      currentStreak: user.currentStreak,
    }));

    return { data: ranked, total, page, limit };
  }
}