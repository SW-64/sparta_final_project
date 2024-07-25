import { User } from '../../user/entities/user.entity';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Membership } from '../../membership/entities/membership.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('community_users')
export class CommunityUser {
  @PrimaryGeneratedColumn({ unsigned: true })
  communityUserId: number;

  @Column({ unsigned: true })
  userId: number;

  @Column({ unsigned: true })
  communityId: number;

  // @Column({ unsigned: true })
  // groupMembershipId: number | null;

  /**
   * 커뮤니티에서 사용할 닉네임
   * @example 별하늘인간 팬
   */
  @IsString()
  @IsNotEmpty()
  @Column()
  nickName: string;

  @IsNumber()
  @Column({ default: false })
  membershipId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => User, (user) => user.communityUser)
  user: User;

  @OneToOne(() => Membership, (membership) => membership.communityUser, { cascade: true })
  membership?: Membership;
}
