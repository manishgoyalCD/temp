import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { RedisService } from 'src/common/redis/services/redis.service';
import { DishesRepository } from '../repositories/dishes.repository';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { REDIS_DEFAULT_TTL } from 'src/common/redis/constants/redis.constant';

@Injectable()
export class DishesService {

  constructor(
    private readonly dishesRepository: DishesRepository,
    private readonly redisService: RedisService,
    private readonly paginationService: PaginationService
  ) { }


  create(cat: any) {
    return ""
  }

  findAll() {
    return ""
  }

  async getDishes(restaurant_id: string, type: string, { page = 1, per_page = 20 } = {}) {
    let total: any = 0
    let result = []
    const skip = await this.paginationService.skip(page, per_page)
    let mongo_query = {
      "restaurant": new Types.ObjectId(restaurant_id)
    }
    if (type) {
      mongo_query['type'] = type
    }
    let dishes = await this.redisService.getDishesList(mongo_query, { page, per_page })
    if (dishes) {
      result = dishes.result
      total = dishes.total

    } else {
      total = await this.dishesRepository.getTotal(mongo_query)
      result = await this.dishesRepository.findAll(mongo_query, {
        skip: skip,
        limit: per_page
      })

      await this.redisService.setDishesList(mongo_query, result, { page, per_page })
    }
    return {
      total,
      result
    }
  }

  async getGroupDishes(find: Record<string, any>, groupBy: Record<string, any>, options: Record<string, any>, redis_key: string) {
    try{
      let result = null
      const redis_data = await this.redisService.get(redis_key)
      if(redis_data){
        result = JSON.parse(redis_data)
      } else {
        const agg_result = await this.dishesRepository.aggregate([
          {
            $match: find
          },
          {
            $unwind: "$type"
          },
          {
            $group: {
              ...groupBy,
              items: { $push: "$$ROOT" }
            }
          },
          {
            $sort: options.sort
          },
          {
            $group: {
              _id: null,
              types: {
                $push: {
                  k: "$_id",
                  v: "$items"
                }
              }
            }
          },
          {
            $project: {
              _id: 0,
              typesObject: { $arrayToObject: "$types" }
            }
          }
        ])
        result = agg_result.length ? (agg_result[0] as any).typesObject : null
        if(result){
          this.redisService.set(redis_key, JSON.stringify(result))
          this.redisService.expire(redis_key, REDIS_DEFAULT_TTL)
        }
      }
      return { result }
    } catch (err) {
      console.log("Error while fetching dishes", err)
      return null;
    }

  }
}