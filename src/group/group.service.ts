import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupService {
  private groups: Group[] = [];
  private idCounter = 1;

  create(createGroupDto: CreateGroupDto): Group {
    const newGroup = { id: this.idCounter++, ...createGroupDto };
    this.groups.push(newGroup);
    return newGroup;
  }

  findAll(): Group[] {
    return this.groups;
  }

  findOne(id: number): Group {
    const group = this.groups.find((group) => group.id === id);
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return group;
  }

  update(id: number, updateGroupDto: UpdateGroupDto): Group {
    const group = this.findOne(id);
    Object.assign(group, updateGroupDto);
    return group;
  }

  remove(id: number): void {
    const index = this.groups.findIndex((group) => group.id === id);
    if (index === -1) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    this.groups.splice(index, 1);
  }
}
