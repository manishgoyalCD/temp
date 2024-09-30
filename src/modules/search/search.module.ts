import { Module } from '@nestjs/common';
import { RestaurantsService } from './services/search.service';
import { SearchController } from './controllers/search.controller';
import { RestaurantRepository } from './repositories/search.repository';
import { EsSearchModule } from 'src/common/elastic_search/elastic_search.module';


@Module({
  controllers: [SearchController],
  imports: [
    EsSearchModule
  ],
  providers: [RestaurantsService, RestaurantRepository],
  exports: [RestaurantsService]
})
export class RestaurantsModule {}
