import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, MaxLength, IsString, IsUUID, MinLength } from "class-validator"

export class CreateUserAnswerDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsNotEmpty()
    @IsUUID()
    questionId!: string;

    @ApiProperty({ example: 'Event Loop is a mechanism that handles async operations...' })
    @IsNotEmpty()
    @IsString()
    @MinLength(20, { message: 'Answer should have at least 20 characters' })
    @MaxLength(3000, { message: 'Answer should not exceed 3000 characters' })
    answerText!: string;
}
