import { IsBoolean, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubmitCodingTaskDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  passed!: boolean;

  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  @IsInt()
  @Min(0)
  timeTaken?: number;
}