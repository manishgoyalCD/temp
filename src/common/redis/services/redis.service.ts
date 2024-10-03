import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigType } from '@nestjs/config';
import redisConfig from 'src/configs/redis.config'
import { RestaurantDocument } from 'src/modules/restaurants/schemas/restaurant.schema';
import { REDIS_DEFAULT_TTL } from '../constants/redis.constant';


const RESTAURANT_KEY = 'onemenu.hash.restaurant'
const DISHES_LIST_KEY = 'onemenu.string.dishes'

/**
 * This service should be used by modules that require direct access to ioredis client. The rest should use
 * redis microservice.
 */
@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    @Inject(redisConfig.KEY)
    private readonly serviceConfig: ConfigType<typeof redisConfig>,
  ) {
    super({ ...serviceConfig });

    this.on('connect', this.handleConnect.bind(this));
    this.on('ready', this.handleReady.bind(this));
    this.on('error', this.handleError.bind(this));
    this.on('close', this.handleClose.bind(this));
    this.on('reconnecting', this.handleReconnecting.bind(this));
    this.on('end', this.handleEnd.bind(this));
  }

  onModuleDestroy() {
    this.disconnect(false);
  }

  private handleConnect() {
    this.logger.log('Redis connecting...');
  }

  private handleReady() {
    this.logger.log('Redis connected!');
  }

  private handleClose() {
    this.logger.warn('Redis disconnected!');
  }

  private handleReconnecting() {
    this.logger.log('Redis reconnecting!');
  }

  private handleEnd() {
    this.logger.warn('Redis connection ended!');
  }

  private handleError(err: any) {
    this.logger.error('Redis error occurred', { err });
  }

  // -----

  getKey(key: string) {
    return this.get(key)
  }


  async getRestaurant(restaurant_id: any, select:string = ""){
    console.log(`${RESTAURANT_KEY}.${restaurant_id}`);
    
    const restaurant = await this.hgetall(`${RESTAURANT_KEY}.${restaurant_id}`)

    if(!Object.keys(restaurant).length)
      return null

    const restaurantData = {
      ...restaurant, 
      location: JSON.parse(restaurant.location), 
      images: JSON.parse(restaurant.images),     
      opening_hours: restaurant.opening_hours ? JSON.parse(restaurant.opening_hours) : null, 
      amenties: JSON.parse(restaurant.amenties),  
      cuisines: JSON.parse(restaurant.cuisines),  
      dishes: JSON.parse(restaurant.dishes),      
      price: parseFloat(restaurant.price),
      overall_reviews: restaurant.overall_reviews ?  JSON.parse(restaurant.overall_reviews) : null
    };
    return restaurantData
    
  }


  async setRestaurant(restaurant: any, ttl=REDIS_DEFAULT_TTL){
    try{
      const _id = restaurant._id.toString()
      const key = `${RESTAURANT_KEY}.${_id}`
      
      const restaurantData = {
        ...restaurant, 
        location: JSON.stringify(restaurant.location), 
        images: JSON.stringify(restaurant.images),     
        opening_hours: JSON.stringify(restaurant.opening_hours), 
        amenties: JSON.stringify(restaurant.amenties),  
        cuisines: JSON.stringify(restaurant.cuisines),  
        dishes: JSON.stringify(restaurant.dishes),      
        price: JSON.stringify(restaurant.price),
        overall_reviews: restaurant.overall_reviews ?  JSON.stringify(restaurant.overall_reviews) : null         
      };
  
      // Convert the restaurant data into an array of key-value pairs for Redis
      const restaurantEntries = Object.entries(restaurantData).flat();
  
      this.hset(key, restaurantEntries)
      this.expire(key, ttl)

      return true
    } catch(err){
      console.log(err);
      
      console.log("Error in setting restaurant in redis - ");
      return false
    }
    
  }


  // Dishes
  async getDishesList(query: any, options:any={}){
    try{
      const _id = query.restaurant.toString()
      let key = `${DISHES_LIST_KEY}.${_id}`
      
      if(query['type']){
        key += `.${query.type}`
      }

      if(options['page']){
        key += `.${options.page}`
      }

      if(options['per_page']){
        key += `.${options.per_page}`
      }

      if(options['sort']){
        key += `.${options.sort}${options.sort}`
      }
      console.log('get', key);
      
      const dish_string = await this.get(key)
      if(!dish_string) return null;

      const dishes_data = JSON.parse(dish_string)

      const dishes_result = []

      for(const dish of dishes_data){
        dishes_result.push({
          ...dish,
          images: JSON.parse(dish.images),
          videos: JSON.parse(dish.videos),
          ingredients: JSON.parse(dish.ingredients),
          addons: JSON.parse(dish.addons),
        })
      }
      return {
        total: dishes_result.length, // Total number of hits
        result: dishes_result
      }
    } catch(err){
      console.log(err);
      console.log("Error in getting  restaurant in redis - ");
      return null
    } 
  }
  

  async setDishesList(query:any, dishes: any, options:any={}, ttl=REDIS_DEFAULT_TTL){
    try{
      const _id = query.restaurant.toString()
      let key = `${DISHES_LIST_KEY}.${_id}`
      
      if(query['type']){
        key += `.${query.type}`
      }

      if(options['page']){
        key += `.${options.page}`
      }

      if(options['per_page']){
        key += `.${options.per_page}`
      }
      console.log('set', key);
      
      
      const dishesData = dishes.map(dish => ({
        ...dish,
        images: JSON.stringify(dish.images),
        videos: JSON.stringify(dish.videos),
        ingredients: JSON.stringify(dish.ingredients),
        addons: JSON.stringify(dish.addons),
      }));

      await this.set(key, JSON.stringify(dishesData))
      this.expire(key, ttl)

      return true
    } catch(err){
      console.log(err);
      console.log("Error in setting dishes in redis - ");
      return false
    }
    
  }

}