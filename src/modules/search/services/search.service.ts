import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
// ---
import { IDatabaseFindAllOptions } from 'src/common/database/interfaces/database.interface';
import { RestaurantRepository } from '../repositories/search.repository';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { RESTAURANT_DEFAULT_DISTANCE, RESTAURANT_DEFAULT_PER_PAGE } from '../constants/search.constant';
import { RestaurantSearchDto } from '../dto/search-search.dto';
import { SearchService } from 'src/common/elastic_search/services/elastic_search.service';

@Injectable()
export class RestaurantsService {
    
    constructor(
        private readonly restaurantRepository: RestaurantRepository,
        private readonly searchService: SearchService
    ) {}

    create(cat:any) {
        return ""
    }

    async findOneById<T>(
        id: string,
        options?: IDatabaseFindAllOptions
    ): Promise<T> {
        return this.restaurantRepository.findOneById<T>(id, options);
    }

    async findOne<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<T> {
        return this.restaurantRepository.findOne<T>(find, options);
    }

    async findAll<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<T[]> {
        return this.restaurantRepository.findAll<T>(find, options);
    }


    async searchRestaurants(filters: RestaurantSearchDto){
        return this.searchService.searchRestaurants(filters)
    }

}