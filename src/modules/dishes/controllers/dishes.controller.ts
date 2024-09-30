import { Controller, Get, Param, Query } from '@nestjs/common';
import { DishesService } from '../services/dishes.service';
import { RedisService } from 'src/common/redis/services/redis.service';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { DishesGetDto } from '../dto/dishes-get.dto';
import { Types } from 'mongoose';


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
            type,
            price_range,
            rating,
            sort
        }: DishesGetDto,
        @Param('RESTAURANT_ID')restaurant_id: string
    ): Promise<any> {

        const skip = await this.paginationService.skip(page, per_page)
        const options = {}
        const find = {'restaurant_id': new Types.ObjectId(restaurant_id)}
        if(rating){
            find['rating'] = {
                $gte: rating
            }
        }
        if(price_range){
            const {min, max} = price_range;
            find['price'] = {
                $gte: min,
                $lte: max
            }
        }
        if(skip){
            options['skip'] = skip
        } else {
            options['skip'] = 0
        }
        if(per_page){
            options['limit'] = per_page
        }
        if(sort){
            options['sort'] = sort
        }
    
        const dishes = await this.dishesService.getDishes(restaurant_id, type, {page, per_page})
        const total_page = await this.paginationService.totalPage(dishes.total, per_page)
        return {
            total: dishes.total,
            total_pages: total_page,
            page: page,
            dishes: dishes.result
        }
    }
}
