import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoRepositoryAbstract } from 'src/common/database/abstracts/database.mongo-repository.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { IDatabaseRepositoryAbstract } from 'src/common/database/interfaces/database.repository.interface';
import {
    RestaurantDocument,
    RestaurantEntity,
    RestaurantSchema
} from 'src/modules/restaurants/schemas/restaurant.schema';

@Injectable()
export class RestaurantRepository
    extends DatabaseMongoRepositoryAbstract<RestaurantDocument>
    implements IDatabaseRepositoryAbstract<RestaurantDocument>
{
    constructor(
        @DatabaseEntity(RestaurantEntity.name)
        private readonly restaurantModel: Model<RestaurantDocument>
    ) {
        super(restaurantModel);
    }
}
