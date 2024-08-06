import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { MerchandisePost } from '../../merchandise/entities/merchandise-post.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { MerchandiseOption } from 'src/merchandise/entities/marchandise-option.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  // 카트 연결
  @ManyToOne(() => Cart, (cart) => cart.cartItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  //상품 연결
  @ManyToOne(
    () => MerchandisePost,
    (merchandisePost) => merchandisePost.cartItems,
    { onDelete: 'CASCADE' },
  )
  merchandisePost: MerchandisePost;

  //상품 옵션 연결
  @ManyToOne(() => MerchandiseOption, (option) => option.cartItem, {
    onDelete: 'CASCADE',
  })
  merchandiseOption: MerchandiseOption;

  @Column()
  quantity: number;
}