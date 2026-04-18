import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger'
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class GetTopicsDto extends PaginationDto {
    @ApiPropertyOptional({ example: 'javascript' })
    @IsString()
    @IsOptional()
    search?: string;
}
