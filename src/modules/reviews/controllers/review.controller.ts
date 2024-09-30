import { Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { ReviewService } from '../services/review.service';
import { RedisService } from 'src/common/redis/services/redis.service';
import { RestaurantGetDto } from '../dto/review-get.dto';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { Types } from 'mongoose';
import { RestaurantIdDto } from 'src/modules/restaurants/dto/restaurantId.dto';


@Controller('review')
export class ReviewController {
    constructor(
        private readonly ReviewService: ReviewService,
        private readonly redisService: RedisService,
        private readonly paginationService: PaginationService
    ) {}

    /* TODO:
        - user
            - name
            - location
            - Image
        - Revive
            - Comment
            - Rating
            - Is verified
            - Created on
            - Images

        # Approach
            - add ids in string 
            - add comment in redis hash

    */
    @Get('/:RESTAURANT_ID/get')
    async getAllComments(
        @Query(){
            page,
            per_page,
            sort,
            rating
        }:RestaurantGetDto,
        @Param('RESTAURANT_ID') restaurant_id: string
    ): Promise<any> {
        const skip = await this.paginationService.skip(page, per_page)
        const query = {'restaurant_id': new Types.ObjectId(restaurant_id)}
        const options = {}
        if(rating){
            query['rating'] = {
                $gte: rating
            }
        }
        if(skip){
            options['skip'] = skip
        }
        if(per_page){
            options['limit'] = per_page
        }
        if(sort){
            options['sort'] = sort
        }

        await this.ReviewService.getRestaurantReview(query, options)

        return {
            dish : "",
        }
    }

    @Get('/:COMMENT_ID/get')
    async getComment(): Promise<any> {
        return {
            dish : "",
            'fdsaf': await this.redisService.getKey('fdsaf')
        }
    }


    @Post('/:COMMENT_ID/like')
    @HttpCode(200)
    async likeComment(): Promise<any> {
        return {
            dish : "",
            'fdsaf': await this.redisService.getKey('fdsaf')
        }
    }

    @Post('/:COMMENT_ID/dislike')
    @HttpCode(200)
    async dishLikeComment(): Promise<any> {
        return {
            dish : "",
            'fdsaf': await this.redisService.getKey('fdsaf')
        }
    }

    @Post('/:COMMENT_ID/report')
    async reportComment(): Promise<any> {
        return {
            dish : "",
            'fdsaf': await this.redisService.getKey('fdsaf')
        }
    }
}
