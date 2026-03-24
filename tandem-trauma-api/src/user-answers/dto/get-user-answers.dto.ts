import { PaginationDto } from "src/common/dto/pagination.dto";
import { AnswerStatus } from "../entities/user-answer.entity";
import { IsOptional, IsUUID, IsEnum } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class GetUserAnswersDto extends PaginationDto {
    @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsOptional()
    @IsUUID()
    questionId?: string;

    @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsOptional()
    @IsUUID()
    userId?: string;

    @ApiPropertyOptional({ example: AnswerStatus.PENDING })
    @IsOptional()
    @IsEnum(AnswerStatus)
    status?: AnswerStatus;
}