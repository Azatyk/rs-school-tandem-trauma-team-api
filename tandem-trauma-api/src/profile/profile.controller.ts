import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
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
  @ApiOkResponse({
    description: 'Profile details with solved tasks breakdown successfully retrieved.',
    schema: {
      example: {
        name: 'John Doe',
        email: 'user@example.com',
        memberSince: '2026-01-15T00:00:00.000Z',
        stats: { currentStreak: 5, longestStreak: 12, totalSolvedTasks: 15 },
        difficultyBreakdown: { easy: 10, medium: 4, hard: 1 },
        topicMastery: { JavaScript: 85, React: 60, CSS: 90 },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access. The JWT token is missing or invalid.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  getProfile(@CurrentUser('userId') userId: string): Promise<ProfileResponse> {
    return this.profileService.getProfile(userId);
  }

  @Get('matrix')
  @ApiOperation({ summary: 'Get skill progress matrix by topic and difficulty' })
  @ApiOkResponse({
    description: 'Progress matrix retrieved successfully.',
    schema: {
      example: {
        TypeScript: {
          easy: { solved: 3, avgScore: 8.5 },
          medium: { solved: 1, avgScore: 7.0 },
        },
        'DOM Manipulation': {
          hard: { solved: 2, avgScore: 9.0 },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access.' })
  getMatrix(@CurrentUser('userId') userId: string) {
    return this.profileService.getProgressMatrix(userId);
  }
}