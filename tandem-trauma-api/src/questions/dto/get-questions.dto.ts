import { IsOptional, IsString, IsUUID } from "class-validator"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { PaginationDto } from "src/common/dto/pagination.dto"

export class GetQuestionsDto extends PaginationDto {
    @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsOptional()
    @IsUUID()
    topicId?: string;

    @ApiPropertyOptional({ example: 'closures' })
    @IsString()
    @IsOptional()
    search?: string;
}