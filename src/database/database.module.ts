import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from '../group/entities/group.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'root',
      database: 'bao',
      entities: [Group, User],
      synchronize: true, // Only for development, disable in production
    }),
  ],
})
export class DatabaseModule {}
