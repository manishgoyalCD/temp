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

    @Get('/')
    async getDefaultDishes(){
        return null;
    }

    @Get('/:RESTAURANT_ID/get')
    async getRestaurantDishes(
        @Query(){
            page,
            per_page,
            type,
            price_range,
            rating,
            sort
        }: DishesGetDto,
        @Param('RESTAURANT_ID')restaurant_id: string
    ): Promise<any> {
        console.log({
            page,
            per_page,
            type,
            price_range,
            rating,
            sort
        });
        
        const skip = await this.paginationService.skip(page, per_page)
        const options = {}
        const find = {'restaurant': new Types.ObjectId(restaurant_id)}
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
            result: dishes.result.length,
            dishes: dishes.result
        }
    }

    @Get('/:RESTAURANT_ID/group-by-type')
    async getGroupDishes(
        @Query(){
            type,
            sort
        }: DishesGetDto,
        @Param('RESTAURANT_ID')restaurant_id: string
    ): Promise<any> {

        const options = {}
        const find = {'restaurant': new Types.ObjectId(restaurant_id)}
        let redis_key = `${type || '$type'}`
        const groupBy = {
            _id: type || '$type'
        }
       
        if(sort){
            let redis_key = `s.${options['sort']}${sort}`
            options['sort'] = sort
        }

        const dishes = await this.dishesService.getGroupDishes(find,groupBy, options, redis_key)
        
        return {
            dishes: dishes.result
        }
    }
}
