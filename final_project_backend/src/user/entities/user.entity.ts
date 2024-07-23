import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  /**
   * 이름
   * @example"신짱구"
   */
  @IsNotEmpty({ message: `이름을 입력해 주세요.` })
  @IsString()
  @Column()
  name: string;
  /**
   * 이메일
   * @example "example@example.com"
   */
  @IsNotEmpty({ message: `이메일을 입력해 주세요.` })
  @IsEmail({}, { message: `이메일 형식에 맞지 않습니다.` })
  @Column({ unique: true })
  email: string;

  /**
   * 비밀번호
   * @example "Example1!"
   */
  @IsNotEmpty({ message: '비밀번호를 입력해 주세요.' })
  @IsStrongPassword(
    { minLength: 8 },
    {
      message: `비밀번호는 영문 알파벳 대,소문자, 숫자, 특수문자(!@#$%^&*)를 포함해서 8자리 이상으로 입력해야 합니다.`,
    },
  )
  @Column({ select: false })
  password: string;

  /**
   * 이미지URL
   * @example "https://i.namu.wiki/i/egdn5_REUgKuBUNPwkOg3inD6mLWMntHc-kXttvomkvaTMsWISF5sQqpHsfGJ8OUVqWRmV5xkUyRpD2U6g_oO03po08TisY6pAj5PXunSWaOHtGwrvXdHcL3p9_9-ZPryAadFZUE2rAxiK9vo5cv7w.svg"
   */
  @IsNotEmpty({ message: '이미지 URL을 입력해 주세요.' })
  @IsString()
  @Column()
  profile_image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ default: 'user' }) //enum 타입으로 바꿀 예정
  role: string;
}