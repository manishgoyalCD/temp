import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { Types} from 'mongoose';
// --
import { RestaurantsService } from '../services/restaurants.service';
import { RedisService } from 'src/common/redis/services/redis.service';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { RestaurantGetDto } from '../dto/restaurant-get.dto';


@Controller('restaurants')
export class RestaurantsController {
    constructor(
        private readonly restaurantService: RestaurantsService,
        private readonly redisService: RedisService,
        private readonly paginationService: PaginationService
    ) {}


    @Get('/')
    async root(): Promise<any> {
        return {
            'status': 'ok'
        }
    }

    @Get('/')
    async findAll(): Promise<any> {
        return {
            'status': 'ok'
        }
    }
    
    @Get('/get')
    async restaurantsGet(
        @Query(){
            page
        }: RestaurantGetDto
    ): Promise<any> {
        
    }

    @Get('/:RESTAURANT_ID/get')
    async RestaurantDetails(
        @Param('RESTAURANT_ID') restaurant_id: string
    ): Promise<any> {
        console.log(restaurant_id);
        
        let restaurant = await this.redisService.getRestaurant(restaurant_id)

        if(!restaurant){
            restaurant = await this.restaurantService.findOne({_id: new Types.ObjectId(restaurant_id)})
            this.redisService.setRestaurant(restaurant)
        }
        return restaurant
    }


    @Get('/:RESTAURANT_ID/menus/get')
    async RestaurantGetMenus(
        
    ): Promise<any> {
        return null;
    }
}
