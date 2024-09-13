import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoRepositoryAbstract } from 'src/common/database/abstracts/database.mongo-repository.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { IDatabaseRepositoryAbstract } from 'src/common/database/interfaces/database.repository.interface';
import {
    ReviewDocument,
    ReviewEntity,
    ReviewSchema
} from 'src/modules/reviews/schemas/review.schema';

@Injectable()
export class ReviewRepository
    extends DatabaseMongoRepositoryAbstract<ReviewDocument>
    implements IDatabaseRepositoryAbstract<ReviewDocument>
{
    constructor(
        @DatabaseEntity(ReviewEntity.name)
        private readonly ReviewModel: Model<ReviewDocument>
    ) {
        super(ReviewModel);
    }
}
