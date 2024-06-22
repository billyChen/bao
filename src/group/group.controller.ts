import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @Get()
  findAll() {
    return this.groupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(+id, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupService.delete(+id);
  }

  @Delete()
  async deleteAll() {
    await this.groupService.deleteAll();
  }

  @Patch(':id/add-member')
  addMember(
    @Param('id') groupId: string,
    @Body() addUserDto: { userId: number },
  ) {
    return this.groupService.addMember(+groupId, addUserDto.userId);
  }

  @Patch('link/:link/add-member')
  addMemberByLink(
    @Param('link') link: string,
    @Body() addUserDto: { userId: number },
  ) {
    return this.groupService.addMemberByLink(link, addUserDto.userId);
  }
}
