import { IsString, IsEnum, IsUUID, IsArray, ValidateNested, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CodingTaskDifficulty, TestCase } from '../entities/coding-task.entity';

export class TestCaseDto {
  @ApiProperty({ example: '[1, 2, 3]' })
  @IsString()
  input!: string;

  @ApiProperty({ example: '6' })
  @IsString()
  expected!: string;

  @ApiProperty({ example: 'Sum of array elements' })
  @IsString()
  description!: string;
}

export class CreateCodingTaskDto {
  @ApiProperty({ example: 'Sum of Array' })
  @IsString()
  @MinLength(3)
  title!: string;

  @ApiProperty({ example: 'Write a function that returns the sum of all elements in an array.' })
  @IsString()
  @MinLength(10)
  description!: string;

  @ApiProperty({ example: 'function sum(arr) {\n  // your code here\n}' })
  @IsString()
  starter_code!: string;

  @ApiProperty({ example: 'function sum(arr) {\n  return arr.reduce((a, b) => a + b, 0);\n}' })
  @IsString()
  solution_code!: string;

  @ApiProperty({ type: [TestCaseDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestCaseDto)
  test_cases!: TestCaseDto[];

  @ApiProperty({ enum: CodingTaskDifficulty, example: 'easy' })
  @IsEnum(CodingTaskDifficulty)
  difficulty!: CodingTaskDifficulty;

  @ApiProperty({ example: '8ad7213c-38e4-4828-a9b9-3afc0d1c02b2' })
  @IsUUID()
  topic_id!: string;
}