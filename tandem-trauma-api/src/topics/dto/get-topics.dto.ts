import { IsOptional, IsPositive, Max, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger'

export class GetTopicsDto {
    @ApiPropertyOptional({ example: 10, default: 10 })
    @IsOptional()
    @IsPositive()
    @IsInt()
    @Max(50)
    @Type(() => Number)
    limit?: number;

    @ApiPropertyOptional({ example: 1, default: 1 })
    @IsOptional()
    @IsPositive()
    @IsInt()
    @Type(() => Number)
    page?: number;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    search: string | undefined;
}