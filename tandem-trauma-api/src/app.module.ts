import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: '12345',
      database: 'tandem_trauma_db',
      entities: [User],
      synchronize: true, // set to false in prod
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
