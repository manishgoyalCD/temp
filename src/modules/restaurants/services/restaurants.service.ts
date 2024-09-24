import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
// ---
import { IDatabaseFindAllOptions } from 'src/common/database/interfaces/database.interface';
import { RestaurantRepository } from '../repositories/restaurant.repository';

@Injectable()
export class RestaurantsService {
    
    constructor(
        private readonly restaurantRepository: RestaurantRepository
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


}