import { GroupType } from 'src/group/entities/group.entity';

export class CreateGroupDto {
  name: string;
  description: string;
  userId: number;
  type: GroupType;
  productId?: string;
  orderAmount?: number;
  maxMembers: number;
  endDate: Date;
}
