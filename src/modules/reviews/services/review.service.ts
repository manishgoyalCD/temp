import { Injectable } from '@nestjs/common';
import { IDatabaseFindAllOptions } from 'src/common/database/interfaces/database.interface';
import { ReviewRepository } from '../repositories/review.repository';
import { RedisService } from 'src/common/redis/services/redis.service';


const REVIEW_LIST_KEY = 'onemenu.string.dishes'
const HASH_KEY = 'onemenu.hash.dishes'
@Injectable()
export class ReviewService {

    constructor(
        private readonly reviewRepository: ReviewRepository,
        private readonly redisService: RedisService
    ){}


    create(cat: any) {
        return ""
    }

    async findOneById<T>(
        id: string,
        options?: IDatabaseFindAllOptions
    ): Promise<T> {
        return this.reviewRepository.findOneById<T>(id, options);
    }

    async findOne<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<T> {
        return this.reviewRepository.findOne<T>(find, options);
    }

    async findAll<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<T[]> {
        return this.reviewRepository.findAll<T>(find, options);
    }


    async buildRedisReviewListKey(query: any, options?: any){
        const _id = query.restaurant_id.toString()
        let key_list = `${HASH_KEY}.${_id}`

        if(query['rating']){
            key_list += `.${query.rating}`
        }

        if(options['page']){
            key_list += `.${options.page}`
        }

        if(options['per_page']){
            key_list += `.${options.per_page}`
        }

        if(options['sort']){
            const sort_key = Object.keys(options.sort)[0]
            const sort_value = options.sort[sort_key]
            key_list += `.${sort_key}.${sort_value}`
        }

        return key_list
    }

    async getRestaurantReview(find: any, options?: any) {
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
        try {
            let total:any = 0
            let result = []

            const review = await this.getRestaurantRedisReview(find, options)

            if(!review){
                total = this.reviewRepository.getTotal(find, options)
                options['populate'] = true
                result = await this.findAll(find, options)
            }

            return {
                total: await total,
                result
            }
        } catch(err){
            console.log('Error while fetching reviews', err)
            return null
        }
        

    }

    async getRestaurantRedisReview(query: any, options?: any) {
        console.log(query);
        console.log(options);
                
        const key_list = await this.buildRedisReviewListKey(query, options)
        console.log(key_list);

        const list_string = await this.redisService.get(key_list)
        if(!list_string){
            console.log("Review list was not set - ", key_list);
            return null
        }
        const json_data = JSON.parse(list_string)
        const total = json_data.total
        const list_data = json_data.result

        const pipeline = await this.redisService.multi()

        for(const doc of list_data){
            const doc_id = doc._id
            pipeline.hgetall(`${key_list}.${doc_id}`)
        }
        const result = await pipeline.exec()
        return {
            total: total,
            result: result
        }


    }

}