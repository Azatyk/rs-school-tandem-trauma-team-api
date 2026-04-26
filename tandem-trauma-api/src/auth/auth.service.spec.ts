import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const mockUser = {
  id: 'uuid-123',
  email: 'test@test.com',
  name: 'Test User',
  passwordHash: 'hashed_password',
};

const mockUsersRepository = {
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue('mock_token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUsersRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should register a new user successfully', async () => {
    mockUsersRepository.findOneBy.mockResolvedValue(null);
    mockUsersRepository.create.mockReturnValue(mockUser);
    mockUsersRepository.save.mockResolvedValue(mockUser);

    const result = await service.register({
      email: 'test@test.com',
      name: 'Test User',
      password: 'password123',
    });

    expect(result).toEqual(mockUser);
    expect(mockUsersRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should throw BadRequestException if email already exists', async () => {
    mockUsersRepository.findOneBy.mockResolvedValue(mockUser);

    await expect(
      service.register({
        email: 'test@test.com',
        name: 'Test User',
        password: 'password123',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should login successfully with correct credentials', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const userWithHash = { ...mockUser, passwordHash: hashedPassword };

    mockUsersRepository.createQueryBuilder.mockReturnValue({
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(userWithHash),
    });

    const result = await service.login({
      email: 'test@test.com',
      password: 'password123',
    });

    expect(result.access_token).toBe('mock_token');
    expect(result.user.email).toBe('test@test.com');
  });

  it('should throw UnauthorizedException if user not found', async () => {
    mockUsersRepository.createQueryBuilder.mockReturnValue({
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(null),
    });

    await expect(
      service.login({ email: 'wrong@test.com', password: 'password123' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if password is wrong', async () => {
    const hashedPassword = await bcrypt.hash('correctpassword', 10);
    const userWithHash = { ...mockUser, passwordHash: hashedPassword };

    mockUsersRepository.createQueryBuilder.mockReturnValue({
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(userWithHash),
    });

    await expect(
      service.login({ email: 'test@test.com', password: 'wrongpassword' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});