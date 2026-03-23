import { IsString, IsNotEmpty, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTopicDto {
 @ApiProperty({ example: 'JavaScript', description: 'Topic title' })
 @IsNotEmpty()
 @IsString()
 @MinLength(5, {message: 'Title should have at least 5 characters' })
 @MaxLength(150, { message: 'Title should not have more than 150 characters' })
 title: string;

 @ApiPropertyOptional()
 @IsOptional()
 @IsString()
 @MinLength(10, { message: 'Description should have at least 10 characters' })
 @MaxLength(500, { message: 'Description should not have more than 500 characters' })
 description: string | null;
}