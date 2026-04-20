import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { PaginationDto } from "src/common/dto/pagination.dto"
import { QuestionDifficulty } from "../entities/question.entity"

export class GetQuestionsDto extends PaginationDto {
    @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsOptional()
    @IsUUID()
    topic_id?: string;

    @ApiPropertyOptional({ example: 'closures' })
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({ enum: QuestionDifficulty, example: QuestionDifficulty.EASY })
    @IsOptional()
    @IsEnum(QuestionDifficulty)
    difficulty?: QuestionDifficulty;
}
