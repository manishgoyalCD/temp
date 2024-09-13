import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserEntity, UserSchema, UserDatabaseName } from './schemas/user.schema';
import { UserRepository } from './repositories/user.repository';


@Module({
  controllers: [UserController],
  imports: [
    MongooseModule.forFeature(
      [
          {
              name: UserEntity.name,
              schema: UserSchema,
              collection: UserDatabaseName,
          },
      ],
      DATABASE_CONNECTION_NAME
    ),
  ],
  providers: [UserService, UserRepository],
  exports: [UserService]
})
export class UserModule {}


