import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Like } from './entities/like.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLikeDto } from './dto/create-like.dto';
import { ItemType } from './types/itemType.types';
import { Post } from 'src/post/entities/post.entity';
import { MESSAGES } from 'src/constants/message.constant';
import { ApiResponse } from 'src/util/api-response.interface';
import { createResponse } from 'src/util/response-util';
import { Comment } from 'src/comment/entities/comment.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commetRepository: Repository<Comment>,
  ) {}

  async updateLikeStatus(
    userId: number,
    itemId: number,
    createLikeDto: CreateLikeDto,
    itemType: ItemType,
  ): Promise<ApiResponse<Like>> {
    let existedItem;

    // 좋아요 대상 아이템 조회 - Post, Comment
    if (itemType === ItemType.POST) {
      existedItem = await this.findPostById(itemId);
    } else if (itemType === ItemType.COMMENT) {
      existedItem = await this.findCommentById(itemId);
    }

    if (!existedItem) {
      throw new NotFoundException(MESSAGES.LIKE.ITEMID.NOT_FOUND);
    }

    // DB에서 기존 Like 엔티티 조회
    let like = await this.likeRepository.findOne({
      where: { userId, itemId, itemType },
    });

    if (like) {
      like.status = createLikeDto.status;
    } else {
      like = this.likeRepository.create({
        userId,
        itemId,
        status: createLikeDto.status,
        itemType,
      });
    }

    const savedLike = await this.likeRepository.save(like);

    return createResponse(
      HttpStatus.OK,
      MESSAGES.LIKE.UPDATE_STATUS.SECCEED,
      savedLike,
    );

    return createResponse(
      HttpStatus.OK,
      MESSAGES.LIKE.UPDATE_STATUS.SECCEED,
      like,
    );
  }

  async findPostById(postId: number) {
    return await this.postRepository.findOne({ where: { postId } });
  }

  async findCommentById(commentId: number) {
    return await this.commetRepository.findOne({ where: { commentId } });
  }
}