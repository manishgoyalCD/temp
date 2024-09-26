import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { Types} from 'mongoose';
// --
import { RestaurantsService } from '../services/restaurants.service';
import { RedisService } from 'src/common/redis/services/redis.service';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { RestaurantGetDto } from '../dto/restaurant-get.dto';
import { RestaurantSearchDto } from '../dto/restaurant-search.dto';


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
    
    @Get('/search')
    async restaurantsGet(
        @Query(){
            page,
            per_page,
            dietary,
            location,
            distance,
            price_range,
            rating
        }: RestaurantSearchDto
    ): Promise<any> {
        console.log({page,
            dietary,
            location,
            distance,
            price_range,
            rating});
        const skip = await this.paginationService.skip(page, per_page)
        const restaurants = await this.restaurantService.searchRestaurants({page,per_page,
            dietary,
            location,
            distance,
            price_range,
            rating, skip})

        const total = restaurants.total
        const total_pages = await this.paginationService.totalPage(total, per_page)

        return {
            total,
            total_pages,
            page,
            location,
            restaurants: restaurants.result
        }
        
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
