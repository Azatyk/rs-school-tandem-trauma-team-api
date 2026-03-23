import { IsNotEmpty, MinLength, MaxLength, IsString, IsUUID } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateQuestionDto {
    @ApiProperty({ example: 'What is Event Loop in JavaScript?' })
    @IsNotEmpty()
    @IsString()
    @MinLength(10, {message: 'Question should have at least 10 characters'})
    @MaxLength(500, {message: 'Question should not have more than 500 characters'})
    theoretical_question: string;

    @ApiProperty({ example: 'The JavaScript Event Loop is a mechanism that allows JavaScript, a single-threaded language, to handle asynchronous operations' })
    @IsNotEmpty()
    @IsString()
    @MinLength(10, { message: 'Golden answer should have at least 10 characters' })
    @MaxLength(2500, { message: 'Golden answer should not have more than 2500 characters' })
    golden_answer: string


    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsNotEmpty()
    @IsUUID()
    topicId: string;
}