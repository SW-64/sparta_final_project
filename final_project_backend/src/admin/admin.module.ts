import { Module } from '@nestjs/common';

import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Artist } from './entities/artist.entity';
import { Manager } from './entities/manager.entity';
import { Community } from 'src/community/entities/community.entity';
import { AdminArtistController } from './controllers/admin-artist.controller';
import { AdminManagerController } from './controllers/admin-manager.controller';
import { AdminArtistService } from './services/admin-artist.service';
import { AdminManagerService } from './services/admin-manager.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Artist, Manager, Community]),
    AuthModule,
  ],
  controllers: [AdminArtistController, AdminManagerController],
  providers: [AdminArtistService, AdminManagerService],
})
export class AdminModule {}