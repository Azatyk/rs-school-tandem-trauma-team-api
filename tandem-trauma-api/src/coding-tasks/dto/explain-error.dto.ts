import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExplainErrorDto {
  @ApiProperty({ example: 'TypeError: Cannot read property of undefined' })
  @IsString()
  @MinLength(5)
  error!: string;

  @ApiProperty({ example: 'function sum(arr) { return arr.reduc((a,b) => a+b, 0); }' })
  @IsString()
  user_code!: string;
}