import { Module } from '@nestjs/common';
import { LiveController } from './live.controller';
import { LiveService } from './live.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Community } from 'src/community/entities/community.entity';
import { CommunityUser } from 'src/community/entities/communityUser.entity';
import { Artist } from 'src/admin/entities/artist.entity';
import { Live } from './entities/live.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Community, CommunityUser, User, Artist, Live])],
    providers: [LiveService],
    controllers: [LiveController],
  })
export class LiveModule {}
