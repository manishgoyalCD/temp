import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { Types} from 'mongoose';
// --
import { RestaurantsService } from '../services/search.service';
import { RedisService } from 'src/common/redis/services/redis.service';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { RestaurantGetDto } from '../dto/search-get.dto';
import { RestaurantSearchDto } from '../dto/search-search.dto';
import { RestaurantGetDefaultDto } from '../dto/search-getdefault.dto';


@Controller('restaurants')
export class SearchController {
    constructor(
        private readonly restaurantService: RestaurantsService,
        private readonly redisService: RedisService,
        private readonly paginationService: PaginationService
    ) {}


    @Get('/')
    async searchRestDish(
        @Query(){
            location,
            dietary,
            distance,
            sort
        }: RestaurantGetDefaultDto
    ): Promise<any> {
        // const restaurants = await this.restaurantService.searchRestaurants({
        //     dietary,
        //     location,
        //     distance,
        //     sort})
        return {
            'status': 'ok'
        }
    }
    
    
}
