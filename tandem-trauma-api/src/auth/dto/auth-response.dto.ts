import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;
}

export class AuthDataDto {
  @ApiProperty()
  user: UserResponseDto;

  @ApiProperty()
  access_token: string;
}

export class AuthResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: AuthDataDto;
}