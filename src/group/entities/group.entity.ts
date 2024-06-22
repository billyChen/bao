import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';

export enum GroupType {
  PRODUCT = 'product',
  ORDER = 'order',
}

export enum GroupStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: GroupType })
  type: GroupType;

  @Column({ nullable: true })
  productId?: string;

  @Column({ nullable: true })
  orderAmount?: number;

  @Column({ type: 'enum', enum: GroupStatus, default: GroupStatus.PENDING })
  status: GroupStatus;

  @Column()
  link: string;

  @Column()
  endDate: Date; // End date of the group purchase

  @Column()
  maxMembers: number; // Maximum number of members

  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  members: User[];
}
