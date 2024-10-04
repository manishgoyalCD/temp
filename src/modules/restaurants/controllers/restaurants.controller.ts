import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { Types} from 'mongoose';
// --
import { RestaurantsService } from '../services/restaurants.service';
import { RedisService } from 'src/common/redis/services/redis.service';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { RestaurantGetDto } from '../dto/restaurant-get.dto';
import { RestaurantSearchDto } from '../dto/restaurant-search.dto';
import { RestaurantGetDefaultDto } from '../dto/restaurant-getdefault.dto';
import { ApiBadRequestResponse, ApiBody, ApiQuery, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiParam } from '@nestjs/swagger';


@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
    constructor(
        private readonly restaurantService: RestaurantsService,
        private readonly redisService: RedisService,
        private readonly paginationService: PaginationService
    ) {}


    @Get('/')
    @ApiBadRequestResponse({
        description: "Enter all the required fields", 
        type: Promise<any>,
        example: {
            status: 400,
            message: "Required fields are mandatory"
        }
    })
    async getDefault(
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
    
    @Get('/search')
    @ApiOkResponse({
        description: 'The search query has been executed successfully.',
        type: Promise<any>,
        example: {
            total:100,
            total_pages:10,
            page:1,
            result: 20,
            location:{lon:30.1345425123, lat:21.3543435},
            restaurants: []
        }
      })
      @ApiBadRequestResponse({
        description: "Enter all the required fields", 
        type: Promise<any>,
        example: {
            status: 400,
            message: "Required fields are mandatory"
        }
    })
    async restaurantsGet(
        @Query(){
            page,
            per_page,
            search,
            dietary,
            location,
            distance,
            price_range,
            rating,
            sort
        }: RestaurantSearchDto
    ): Promise<any> {
        const skip = await this.paginationService.skip(page, per_page)
        const restaurants = await this.restaurantService.searchRestaurants({page,per_page,search,
            dietary,
            location,
            distance,
            price_range,
            rating, skip, sort})

        const total = restaurants.total
        const total_pages = await this.paginationService.totalPage(total, per_page)

        return {
            total,
            total_pages,
            page,
            result: restaurants.result.length,
            location,
            restaurants: restaurants.result
        }
        
    }

    @Get('/:RESTAURANT_ID')
    @ApiParam({
        name:'RESTAURANT_ID',
        type: 'string',
        required: true
    })
    @ApiOkResponse({
        description: "The Restaurant has been found successfully",
        type: Promise<any>,
        example:{
            location: {},
            images: [],
            opening_hours: [],
            amenties: [],
            cuisines: [],
            dishes: [],
            price: 100.4,
            overall_reviews: [],
        }
    })
    @ApiBadRequestResponse({
        description: "Enter all the required fields", 
        type: Promise<any>,
        example: {
            status: 400,
            message: "Required fields are mandatory"
        }
    })
    async RestaurantDetails(
        @Param('RESTAURANT_ID') restaurant_id: string
    ): Promise<any> {
        console.log(restaurant_id);
        
        let restaurant = await this.redisService.getRestaurant(restaurant_id)

        if(!restaurant){
            restaurant = await this.restaurantService.findOne({_id: new Types.ObjectId(restaurant_id)})            
            this.redisService.setRestaurant(restaurant, 0)
        }
        
        return restaurant

    }


    @Get('/:RESTAURANT_ID/menus/get')
    @ApiParam({
        name:'RESTAURANT_ID',
        type: 'string',
        required: true
    })
    @ApiBadRequestResponse({
        description: "Enter all the required fields", 
        type: Promise<any>,
        example: {
            status: 400,
            message: "Required fields are mandatory"
        }
    })
    async RestaurantGetMenus(
        
    ): Promise<any> {
        return null;
    }

    // GET Restaurant images

    // Get menus

    // Get similar restaurants

    // 
}



