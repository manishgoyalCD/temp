import { Controller, Get } from '@nestjs/common';
import { RestaurantsService } from '../services/restaurants.service';
import { RedisService } from 'src/common/redis/services/redis.service';


@Controller('restaurants')
export class RestaurantsController {
    constructor(
        private readonly restaurantService: RestaurantsService,
        private readonly redisService: RedisService
    ) {}


    @Get('/')
    async findAll(): Promise<any> {
        return {
            'fdsaf': await this.redisService.getKey('fdsaf')
        }
    }
}
