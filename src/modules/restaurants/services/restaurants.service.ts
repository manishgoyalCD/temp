import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
// ---
import { IDatabaseFindAllOptions, IDatabaseOptions } from 'src/common/database/interfaces/database.interface';
import { RestaurantRepository } from '../repositories/restaurant.repository';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { RESTAURANT_DEFAULT_DISTANCE, RESTAURANT_DEFAULT_PER_PAGE } from '../constants/restaurant.constant';
import { RestaurantSearchDto } from '../dto/restaurant-search.dto';
import { SearchService } from 'src/common/elastic_search/services/elastic_search.service';
import { RestaurantDocument } from '../schemas/restaurant.schema';

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

    // async findOne<T>(
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

    async updateOnebyId(        
        find?:string,
        data?:Record<string,any>,
        options?: IDatabaseOptions
    ): Promise<RestaurantDocument>{
        return this.restaurantRepository.updateOneById(
            find,
            data,
            options
        );
    }

   async updateOne<N>(
        find: Record<string, any>,
        data: N,
        options?: IDatabaseOptions
    ): Promise<RestaurantDocument>{
        return this.restaurantRepository.updateOne<N>(find, data, options)
    };


    async searchRestaurants(filters: RestaurantSearchDto){
        return this.searchService.searchRestaurants(filters)
    }

}