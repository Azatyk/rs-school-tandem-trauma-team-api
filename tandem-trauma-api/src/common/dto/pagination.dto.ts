import { IsOptional, IsInt, IsPositive, Max } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class PaginationDto {
    @ApiPropertyOptional({ example: 1, default: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    page?: number;

    @ApiPropertyOptional({ example: 10, default: 10 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Max(50)
    @Type(() => Number)
    limit?: number;
}