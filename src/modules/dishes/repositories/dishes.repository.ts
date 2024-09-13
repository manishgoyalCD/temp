import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoRepositoryAbstract } from 'src/common/database/abstracts/database.mongo-repository.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { IDatabaseRepositoryAbstract } from 'src/common/database/interfaces/database.repository.interface';
import {
    DishesDocument,
    DishesEntity,
    DishesSchema
} from 'src/modules/dishes/schemas/dishes.schema';

@Injectable()
export class DishesRepository
    extends DatabaseMongoRepositoryAbstract<DishesDocument>
    implements IDatabaseRepositoryAbstract<DishesDocument>
{
    constructor(
        @DatabaseEntity(DishesEntity.name)
        private readonly DishesModel: Model<DishesDocument>
    ) {
        super(DishesModel);
    }
}
