import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { ProfileResponse } from './interfaces/profile.interfaces';

@ApiBearerAuth()
@ApiTags('profile')
@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user profile stats' })
  @ApiResponse({
    status: 200,
    description: 'Profile with solved tasks breakdown and XP',
    schema: {
      example: {
        name: 'John Doe',
        email: 'user@example.com',
        memberSince: '2026-01-15T00:00:00.000Z',
        xp: 250,
        stats: { currentStreak: 5, longestStreak: 12, totalSolvedTasks: 15 },
        difficultyBreakdown: { easy: 10, medium: 4, hard: 1 },
        topicMastery: { JavaScript: 85, React: 60, CSS: 90 },
        recentActivity: [
          {
            taskId: '101',
            title: 'Implement debounce',
            completedAt: '2026-04-20T10:00:00.000Z',
          },
        ],
      },
    },
  })
  getProfile(@CurrentUser('userId') userId: string): Promise<ProfileResponse> {
    return this.profileService.getProfile(userId);
  }
}
