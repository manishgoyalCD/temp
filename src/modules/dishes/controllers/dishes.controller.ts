import { Controller, Get, Param, Query } from '@nestjs/common';
import { DishesService } from '../services/dishes.service';
import { RedisService } from 'src/common/redis/services/redis.service';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { DishesGetDto } from '../dto/dishes-get.dto';


@Controller('dishes')
export class DishesController {
    constructor(
        private readonly dishesService: DishesService,
        private readonly redisService: RedisService,
        private readonly paginationService: PaginationService
    ) {}


    @Get('/:RESTAURANT_ID/get')
    async getRestaurantDishes(
        @Query(){
            page = 1,
            per_page = 20,
            type
        }:DishesGetDto,
        @Param('RESTAURANT_ID')restaurant_id: string
    ): Promise<any> {
        const dishes = await this.dishesService.getDishes(restaurant_id,type, {page, per_page})
        const total_page = await this.paginationService.totalPage(dishes.total, per_page)
        return {
            total: dishes.total,
            total_pages: total_page,
            page: page,
            dishes: dishes.result
        }
    }
}
