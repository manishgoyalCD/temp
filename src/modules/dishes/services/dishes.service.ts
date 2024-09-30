import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { RedisService } from 'src/common/redis/services/redis.service';
import { DishesRepository } from '../repositories/dishes.repository';
import { PaginationService } from 'src/common/pagination/services/pagination.service';

@Injectable()
export class DishesService {

  constructor(
    private readonly dishesRepository: DishesRepository,
    private readonly redisService: RedisService,
    private readonly paginationService: PaginationService
  ){}
    

  create(cat:any) {
    return ""
  }

  findAll() {
    return ""
  }

  async getDishes(restaurant_id: string, type:string, {page=1, per_page=20}={}){
    let total:any = 0
    let result = []
    const skip = await this.paginationService.skip(page, per_page)
    let mongo_query = {
      "restaurant_id": new Types.ObjectId(restaurant_id)
    }
    if(type){
      mongo_query['type'] = type
    }
    let dishes = await this.redisService.getDishesList(mongo_query, {page, per_page})
    if(dishes){
        result = dishes.result
        total = dishes.total
        
    } else {
        total = await this.dishesRepository.getTotal(mongo_query)
        result = await this.dishesRepository.findAll(mongo_query, {
            skip: skip,
            limit: per_page
        })
        
        await this.redisService.setDishesList(mongo_query, result, {page, per_page})
    }
    
    return {
        total,
        result
    }
  }
}