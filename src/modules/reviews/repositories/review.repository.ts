import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoRepositoryAbstract } from 'src/common/database/abstracts/database.mongo-repository.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { IDatabaseRepositoryAbstract } from 'src/common/database/interfaces/database.repository.interface';
import { DishesEntity } from 'src/modules/dishes/schemas/dishes.schema';
import {
    ReviewDocument,
    ReviewEntity,
} from 'src/modules/reviews/schemas/review.schema';
import { UserEntity } from 'src/modules/user/schemas/user.schema';

@Injectable()
export class ReviewRepository
    extends DatabaseMongoRepositoryAbstract<ReviewDocument>
    implements IDatabaseRepositoryAbstract<ReviewDocument>
{
    constructor(
        @DatabaseEntity(ReviewEntity.name)
        private readonly ReviewModel: Model<ReviewDocument>
    ) {
        super(ReviewModel, [
            {
                path: 'user',
                model: UserEntity.name,
                select: 'first_name last_name photo'
            },
            {
                path: 'dish',
                model: DishesEntity.name,   
            }
        ]);
    }
}
