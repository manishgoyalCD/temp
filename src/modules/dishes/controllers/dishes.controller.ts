import { Controller, Get } from '@nestjs/common';
import { DishesService } from '../services/dishes.service';
import { RedisService } from 'src/common/redis/services/redis.service';


@Controller('dishes')
export class DishesController {
    constructor(
        private readonly restaurantService: DishesService,
        private readonly redisService: RedisService
    ) {}


    @Get('/')
    async findAll(): Promise<any> {
        return {
            dish : "",
            'fdsaf': await this.redisService.getKey('fdsaf')
        }
    }
}
