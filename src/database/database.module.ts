import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from '../group/entities/group.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'your_db_username',
      password: 'your_db_password',
      database: 'your_db_name',
      entities: [Group],
      synchronize: true, // Only for development, disable in production
    }),
  ],
})
export class DatabaseModule {}
