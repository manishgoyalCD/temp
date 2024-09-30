import { Injectable } from '@nestjs/common';
import { IDatabaseFindAllOptions, IDatabaseOptions } from 'src/common/database/interfaces/database.interface';
import { ReviewRepository } from '../repositories/review.repository';
import { RedisService } from 'src/common/redis/services/redis.service';
import { REDIS_DEFAULT_TTL } from 'src/common/redis/constants/redis.constatns';
import { query } from 'express';
import { RestaurantsService } from 'src/modules/restaurants/services/restaurants.service';
import mongoose, { Types } from 'mongoose';
import { RestaurantDocument } from 'src/modules/restaurants/schemas/restaurant.schema';
import { ReviewDocument } from '../schemas/review.schema';


const REVIEW_LIST_KEY = 'onemenu.string.reviews'
const REVIEW_HASH_KEY = 'onemenu.hash.review'
const REVIEW_RESTAURANT_RATING = 'onemenu.hash.restaurant_rating'
@Injectable()
export class ReviewService {

    constructor(
        private readonly reviewRepository: ReviewRepository,
        private readonly redisService: RedisService,
        private readonly restaurantService: RestaurantsService
    ) { }


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

    async updateOnebyId(        
        find?:string,
        data?:Record<string,any>,
        options?: IDatabaseOptions
    ): Promise<ReviewDocument>{
        return this.reviewRepository.updateOneById(
            find,
            data,
            options
        );
    }

    async getRestaurantOverallRating(restaurant_id: string, ttl = REDIS_DEFAULT_TTL){
        const key = `${REVIEW_RESTAURANT_RATING}.${restaurant_id}`
        let rating_obj: any = null

        let review_string = await this.redisService.get(key)
        if(review_string){
            console.log("getRestaurantOverallRating, return form redis");
            rating_obj =  JSON.parse(review_string)
        }

        if(!review_string){
            const restaurant_doc: RestaurantDocument = await this.restaurantService.findOne({_id: new Types.ObjectId(restaurant_id)}, {select:{ 'overall_reviews': 1}, skip: 0, limit: 1})
            console.log("getRestaurantOverallRating, return form find query");
            rating_obj = restaurant_doc.overall_reviews
        }
        if(!rating_obj){
            console.log("getRestaurantOverallRating, return form aggregation");
            const agg_res = await this.reviewRepository.aggregate([
                {
                  '$match': {
                    'restaurant':  new Types.ObjectId(restaurant_id)
                  }
                }, {
                  '$set': {
                    'rating': {
                      '$toInt': '$rating'
                    }
                  }
                },
                {
                    '$addFields': {
                      '1': 0, 
                      '2': 0, 
                      '3': 0, 
                      '4': 0, 
                      '5': 0, 
                      'total': 0
                    }
                },
                {
                  '$group': {
                    '_id': null, 
                    '1': {
                      '$sum': {
                        '$cond': [
                          {
                            '$eq': [
                              '$rating', 1
                            ]
                          }, 1, 0
                        ]
                      }
                    }, 
                    '2': {
                      '$sum': {
                        '$cond': [
                          {
                            '$eq': [
                              '$rating', 2
                            ]
                          }, 1, 0
                        ]
                      }
                    }, 
                    '3': {
                      '$sum': {
                        '$cond': [
                          {
                            '$eq': [
                              '$rating', 3
                            ]
                          }, 1, 0
                        ]
                      }
                    }, 
                    '4': {
                      '$sum': {
                        '$cond': [
                          {
                            '$eq': [
                              '$rating', 4
                            ]
                          }, 1, 0
                        ]
                      }
                    }, 
                    '5': {
                      '$sum': {
                        '$cond': [
                          {
                            '$eq': [
                              '$rating', 5
                            ]
                          }, 5, 0
                        ]
                      }
                    }, 
                    'total': {
                      '$sum': '$rating'
                    },
                    
                  }
                },
                {
                    '$project': {
                      '_id': 0
                    }
                  }
              ])
            rating_obj = agg_res.length ?  agg_res[0] : null
            if(agg_res.length){
                this.restaurantService.updateOne({_id: new Types.ObjectId(restaurant_id)}, {
                    overall_reviews: rating_obj
                })
            }
        }
        if(rating_obj){;
            const pip = this.redisService.multi()
            pip.set(key, JSON.stringify(rating_obj))
            pip.expire(key, ttl)
            pip.exec()
        }
        return rating_obj
    }

    async buildReviewListKey(query: any, options?: any) {
        const _id = query.restaurant.toString()
        let key_list = `${REVIEW_LIST_KEY}.${_id}`

        if (query['rating']) {
            key_list += `.${query.rating}`
        }

        if (options['page']) {
            key_list += `.${options.page}`
        }

        if (options['per_page']) {
            key_list += `.${options.per_page}`
        }

        if (options['sort']) {
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
            let total: any = 0
            let result = []

            const reviews = await this.getRestaurantRedisReview(find, options)
            
            if (reviews) {
                total = reviews.total
                result = reviews.result
            }
            else {
                total = await this.reviewRepository.getTotal(find, options)
                options['populate'] = true
                result = await this.findAll(find, options)
                await this.setRestaurantRedisReview({
                    total: total,
                    result: result
                },find, options)
            }
            
            return {
                total: total,
                result
            }
        } catch (err) {
            console.log('Error while fetching reviews', err)
            return null
        }
    }

    async getRestaurantRedisReview(find: any, options?: any) {
        const key_list = await this.buildReviewListKey(find, options)

        const list_string = await this.redisService.get(key_list)
        if (!list_string) {
            console.log("Review list was not set - ", key_list, list_string);
            return null
        }
        const json_data = JSON.parse(list_string)
        const total = json_data.total
        
        const list_data = json_data.result
        const pipeline = await this.redisService.multi()

        for (const _id of list_data) {
            pipeline.hgetall(`${REVIEW_HASH_KEY}.${_id}`)
        }
        const res = await pipeline.exec()
        
        const result = res.map(subArr => {
            for(const doc of subArr ){
                if(!doc) continue;
                doc['_id'] = (doc as any)._id
                doc['rating'] = doc['rating'] ? parseFloat(doc['rating']) : 3
                doc['is_verified'] = ["True", "true"].includes(doc['is_verified']) 
                doc['images'] = doc['images'] ? JSON.parse(doc['images']) : []
                doc['videos'] = doc['videos'] ? JSON.parse(doc['videos']) : []
                doc['amenties'] = doc['amenties'] ? JSON.parse(doc['amenties']) : []
                doc['user'] = doc['user'] ? JSON.parse(doc['user']) : null
                doc['dish'] = doc['dish'] ? JSON.parse(doc['dish']) : null
               
                return doc
            }
        })

        return {
            total: total,
            result: result
        }
    }

    async setRestaurantRedisReview(doc_list: {total: number, result: Record<string, any>[]}, find: any, options?: any, ttl: number = REDIS_DEFAULT_TTL) {
        try {
            const key_list = await this.buildReviewListKey(find, options)
            if (!doc_list || !find) {
                console.log("Review ids was not set - ", key_list);
                return false
            }
            
            const review_docs = doc_list.result.map((doc: any) => {
                const serializedDoc = {
                    _id: doc._id.toString(),
                    images: doc.images ? JSON.stringify(doc.images) : "[]",
                    videos: doc.videos ? JSON.stringify(doc.videos) : "[]",
                    amenties: doc.amenties ? JSON.stringify(doc.amenties) : "[]",
                    user: doc.user ? JSON.stringify(doc.user) : null,
                    dish: doc.dish ? JSON.stringify(doc.dish) : null
                };
                return Object.assign(serializedDoc, doc);
            });
            const json_data = JSON.stringify({ ...doc_list, result: review_docs.map(doc => doc._id) });

            const pipeline = await this.redisService.multi()
            pipeline.set(key_list, json_data)
            pipeline.expire(key_list, ttl)
            for (const doc of review_docs) {
                const doc_id = doc._id
                doc['_id'] = doc_id.toString()
                doc['images'] = doc['images'] ? JSON.stringify(doc['images']) : "[]"
                doc['videos'] = doc['videos'] ? JSON.stringify(doc['videos']) : "[]"
                doc['amenties'] = doc['amenties'] ? JSON.stringify(doc['amenties']) : "[]"
                doc['user'] = doc['user'] ? JSON.stringify(doc['user']) : null
                doc['dish'] = doc['dish'] ? JSON.stringify(doc['dish']) : null

                const review_hash_key = `${REVIEW_HASH_KEY}.${doc_id}`
                pipeline.hset(review_hash_key, doc)
                pipeline.expire(review_hash_key, ttl)
            }
            await pipeline.exec()
            return true
        } catch(err) {
            console.log("Error while setting review in redis - ", err);
            return false
        }
    }

    async getSubReview(find:Record<string, any>, options){
        try{
            const total = await this.reviewRepository.getTotal(find, options)
            options['populate'] = true
            const result = await this.findAll(find, options)
            
            return {
                total: total,
                result :result
            }
        } catch(err){
            console.log("Error while fetching sun review", err);
            return {
                total: 0,
                result : []
            }
            
        }
            
    }

}