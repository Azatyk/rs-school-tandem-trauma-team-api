import { IsOptional, IsEnum, IsUUID, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CodingTaskDifficulty } from '../entities/coding-task.entity';

export class GetCodingTasksDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  topic_id?: string;

  @ApiPropertyOptional({ enum: CodingTaskDifficulty })
  @IsOptional()
  @IsEnum(CodingTaskDifficulty)
  difficulty?: CodingTaskDifficulty;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}