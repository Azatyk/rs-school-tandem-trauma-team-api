import 'multer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class AvatarService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadAvatar(userId: string, file: Express.Multer.File): Promise<{ avatarUrl: string }> {
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'avatars',
          public_id: `user_${userId}`,
          overwrite: true,
          transformation: [{ width: 200, height: 200, crop: 'fill' }],
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        },
      ).end(file.buffer);
    });

    await this.usersRepository.update(userId, { avatarUrl: result.secure_url });

    return { avatarUrl: result.secure_url };
  }
}