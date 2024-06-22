import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group, GroupStatus, GroupType } from './entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { v4 as uuidv4 } from 'uuid'; // Import UUID

@Injectable()
export class GroupService {
  private groups: Group[] = [];

  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const {
      name,
      description,
      userId,
      type,
      productId,
      orderAmount,
      maxMembers,
    } = createGroupDto;

    // Fetch the user who is creating the group
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Validate group type specific fields
    // TODO: uncomment that when product table is createed
    // if (type === GroupType.PRODUCT && !productId) {
    //   throw new BadRequestException('Product ID is required for product group');
    // }
    if (type === GroupType.ORDER && !orderAmount) {
      throw new BadRequestException('Order amount is required for order group');
    }

    // Create the group and add the user to the members list
    const group = this.groupRepository.create({
      name,
      description,
      type,
      productId: type === GroupType.PRODUCT ? productId : null,
      orderAmount: type === GroupType.ORDER ? orderAmount : null,
      status: GroupStatus.PENDING,
      members: [user],
      maxMembers,
      link: uuidv4(), // Generate a unique link
    });

    return this.groupRepository.save(group);
  }

  findAll(): Promise<Group[]> {
    return this.groupRepository.find({ relations: ['members'] });
  }

  findOne(id: number): Group {
    const group = this.groups.find((group) => group.id === id);
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return group;
  }

  async update(id: number, updateGroupDto: UpdateGroupDto): Promise<Group> {
    const group = await this.groupRepository.preload({
      id: +id,
      ...updateGroupDto,
    });
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    // Validate that the group has at least one member
    if (group.members.length === 0) {
      throw new BadRequestException('A group must have at least one member');
    }

    return this.groupRepository.save(group);
  }

  delete(id: number): void {
    const index = this.groups.findIndex((group) => group.id === id);
    if (index === -1) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    this.groups.splice(index, 1);
  }

  async deleteAll(): Promise<void> {
    await this.groupRepository.delete({});
  }

  async addMember(groupId: number, userId: number): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
      },
      relations: ['members', 'requirements'],
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    if (group.members.length >= group.maxMembers) {
      throw new BadRequestException(
        'The group has reached the maximum number of members',
      );
    }

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Add the user to the group's members
    group.members.push(user);

    // Check if the group meets the requirements to become active
    this.checkRequirements(group);

    return this.groupRepository.save(group);
  }

  async addMemberByLink(link: string, userId: number): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { link },
      relations: ['members'],
    });
    if (!group) {
      throw new NotFoundException(`Group with link ${link} not found`);
    }

    if (group.members.length >= group.maxMembers) {
      throw new BadRequestException(
        'The group has reached the maximum number of members',
      );
    }

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Add the user to the group's members
    group.members.push(user);

    // Check if the group meets the requirements to become active
    this.checkRequirements(group);

    return this.groupRepository.save(group);
  }

  private checkRequirements(group: Group) {
    if (group.type === GroupType.PRODUCT) {
      if (group.maxMembers === group.members.length) {
        group.status = GroupStatus.COMPLETED;
      } else {
        group.status = GroupStatus.PENDING;
      }
    }
  }
}
