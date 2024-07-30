import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { runSeeders } from 'typeorm-extension';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { User } from './user/entities/user.entity';
import AdminSeeder from './database/seeds/admin.seeder';
import { CommunityUser } from './community/entities/communityUser.entity';
import { MembershipPayment } from './membership/entities/membership-payment.entity';
import { Membership } from './membership/entities/membership.entity';
import { Community } from './community/entities/community.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Comment } from './comment/entities/comment.entity';
import { Manager } from './admin/entities/manager.entity';
import { Artist } from './admin/entities/artist.entity';
config();
const configService = new ConfigService();
const options: DataSourceOptions & SeederOptions = {
  namingStrategy: new SnakeNamingStrategy(),
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [
    User,
    CommunityUser,
    MembershipPayment,
    Membership,
    Community,
    Comment,
    Artist,
    Manager,
  ],
  seedTracking: true, // seed데이터가 이미 있다면 삽입 x. 중복 삽입 방지
  seeds: [AdminSeeder],
};

export const dataSource = new DataSource(options);
dataSource.initialize().then(async () => {
  // 데이터베이스 초기화
  //await dataSource.synchronize(true); // 이 작업을 통해 데이터베이스가 엔티티 정의에 따라 업데이트되고 기존 데이터는 삭제.
  await runSeeders(dataSource);
  process.exit();
});
