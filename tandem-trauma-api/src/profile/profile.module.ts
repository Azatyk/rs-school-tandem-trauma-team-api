import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Question } from 'src/questions/entities/question.entity';
import { UserAnswer } from 'src/user-answers/entities/user-answer.entity';
import { User } from 'src/users/user.entity';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { AvatarService } from './avatar.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAnswer, Question]), AuthModule],
  controllers: [ProfileController],
  providers: [ProfileService, AvatarService],
})
export class ProfileModule {}