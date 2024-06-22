import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { Group } from './entities/group.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, User])],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
