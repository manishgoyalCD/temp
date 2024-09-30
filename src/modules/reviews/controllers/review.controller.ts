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
        private readonly reviewService: ReviewService,
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
    async getRestaurantReview(
        @Query(){
            page,
            per_page,
            sort,
            rating
        }:RestaurantGetDto,
        @Param('RESTAURANT_ID') restaurant_id: string
    ): Promise<any> {
        console.log({
            page,
            per_page,
            sort,
            rating
        });
        
        const skip = await this.paginationService.skip(page, per_page)
        const options = {}
        const query = {
            'restaurant': new Types.ObjectId(restaurant_id),
            'review_id': null
        }
        if(rating){
            query['rating'] = {
                $gte: rating
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

        const reviews = await this.reviewService.getRestaurantReview(query, options)
        const total_page = await this.paginationService.totalPage(reviews.total, per_page)
        return {
            total: reviews.total,
            total_page: total_page,
            page: page,
            result: reviews.result.length,
            review: reviews.result,
        }
    }

    @Get('/:RESTAURANT_ID/:REVIEW_ID/get')
    async getAllSubReview(
        @Query(){
            page,
            per_page,
            sort,
            rating
        }:RestaurantGetDto,
        @Param('RESTAURANT_ID') restaurant_id: string,
        @Param('REVIEW_ID') review_id: string
    ): Promise<any> {
        console.log({
            page,
            per_page,
            sort,
            rating,
            review_id,
            restaurant_id
        });
        
        const skip = await this.paginationService.skip(page, per_page)
        const options = {}
        const query = {'restaurant': new Types.ObjectId(restaurant_id), "review_id":  new Types.ObjectId(review_id)}
        if(rating){
            query['rating'] = {
                $gte: rating
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

        const reviews = await this.reviewService.getSubReview(query, options)
        const total_page = await this.paginationService.totalPage(reviews.total, per_page)
        return {
            total: reviews.total,
            total_page: total_page,
            page: page,
            result: reviews.result.length,
            review: reviews.result,
        }
    }

    @Get('/:RESTAURANT_ID/overall-rating')
    async getOverAllRating(
        @Param('RESTAURANT_ID') restaurant_id: string
    ): Promise<any> {
        
        return {
            ratings: await this.reviewService.getRestaurantOverallRating(restaurant_id)
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
