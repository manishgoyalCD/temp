import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { ReviewService } from './services/review.service';
import { ReviewController } from './controllers/review.controller';
import { ReviewEntity, ReviewSchema, ReviewDatabaseName } from './schemas/review.schema';
import { ReviewRepository } from './repositories/review.repository';


@Module({
  controllers: [ReviewController],
  imports: [
    MongooseModule.forFeature(
      [
          {
              name: ReviewEntity.name,
              schema: ReviewSchema,
              collection: ReviewDatabaseName,
          },
      ],
      DATABASE_CONNECTION_NAME
    ),
  ],
  providers: [ReviewService, ReviewRepository],
  exports: [ReviewService]
})
export class ReviewsModule {}


