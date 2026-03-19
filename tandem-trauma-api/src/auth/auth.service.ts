import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existing = await this.usersRepository.findOneBy({ email: dto.email });
    if (existing) {
      throw new BadRequestException({
        success: false,
        message: 'Validation error',
        errors: { email: ['Email already exists'] },
      });
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepository.create({
      email: dto.email,
      name: dto.name,
      passwordHash: hashedPassword,
    });

    await this.usersRepository.save(user);

    return this.generateAuthResponse(user, 'User registered successfully');
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash') // since hash is hidden within api, getting passhash
      .where('user.email = :email', { email: dto.email })
      .getOne();

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException({
        success: false,
        message: 'Invalid email or password',
      });
    }

    return this.generateAuthResponse(user, 'Login successful');
  }

  private async generateAuthResponse(user: User, message: string) {
    const payload = { sub: user.id, email: user.email };
    return {
      success: true,
      message,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        access_token: await this.jwtService.signAsync(payload),
      },
    };
  }
}
