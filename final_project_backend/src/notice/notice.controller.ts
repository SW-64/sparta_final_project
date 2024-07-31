import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('공지사항')
@Controller('v1/notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileFieldsInterceptor([{ name: 'noticeImage', maxCount: 3 }]))
  @Post()
  create(
    @UploadedFiles() files: Express.MulterS3.File[],
    @Request() req,
    @Query('communityId') communityId: number,
    @Body() createNoticeDto: CreateNoticeDto) {
    const imageUrl = files.map((file) => file.location);
    createNoticeDto.noticeImageUrl = JSON.stringify(imageUrl);
    const userId = req.user.id;
    return this.noticeService.create(+userId, +communityId, createNoticeDto);
  }

  /**
   * 모든 공지사항 조회
   * @returns 
   */
  @Get()
  findAll(@Query('communityId') communityId: number) {
    return this.noticeService.findAll(communityId);
  }

  /**
   * 공지 상세 조회
   * @param noticeId 
   * @returns 
   */
  @Get(':noticeId')
  findOne(@Param('noticeId') noticeId: number) {
    return this.noticeService.findOne(+noticeId);
  }

  /**
   * 공지 수정
   * @param req 
   * @param noticeId 
   * @param updateNoticeDto 
   * @returns 
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':noticeId')
  update(@Request() req, @Param('noticeId') noticeId: number, @Body() updateNoticeDto: UpdateNoticeDto) {
    const userId = req.user.id;
    return this.noticeService.update(+userId, +noticeId, updateNoticeDto);
  }

  /**
   * 공지 삭제
   * @param req 
   * @param noticeId 
   * @returns 
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':noticeId')
  remove(@Request() req, @Param('noticeId') noticeId: string) {
    const userId = req.user.id;
    return this.noticeService.remove(+userId, +noticeId);
  }
}
