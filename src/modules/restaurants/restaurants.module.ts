import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { RestaurantsService } from './services/restaurants.service';
import { RestaurantsController } from './controllers/restaurants.controller';
import { RestaurantEntity, RestaurantSchema, RestaurantDatabaseName } from './schemas/restaurant.schema';
import { RestaurantRepository } from './repositories/restaurant.repository';
import { EsSearchModule } from 'src/common/elastic_search/elastic_search.module';


@Module({
  controllers: [RestaurantsController],
  imports: [
    MongooseModule.forFeature(
      [
          {
              name: RestaurantEntity.name,
              schema: RestaurantSchema,
              collection: RestaurantDatabaseName,
          },
      ],
      DATABASE_CONNECTION_NAME
    ),
    EsSearchModule
  ],
  providers: [RestaurantsService, RestaurantRepository],
  exports: [RestaurantsService]
})
export class RestaurantsModule {}
