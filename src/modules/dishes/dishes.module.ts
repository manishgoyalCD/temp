import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { DishesService } from './services/dishes.service';
import { DishesController } from './controllers/dishes.controller';
import { DishesEntity, DishesSchema, DishesDatabaseName } from './schemas/dishes.schema';
import { DishesRepository } from './repositories/dishes.repository';


@Module({
  controllers: [DishesController],
  imports: [
    MongooseModule.forFeature(
      [
          {
              name: DishesEntity.name,
              schema: DishesSchema,
              collection: DishesDatabaseName,
          },
      ],
      DATABASE_CONNECTION_NAME
    ),
  ],
  providers: [DishesService, DishesRepository],
  exports: [DishesService]
})
export class DishesModule {}


