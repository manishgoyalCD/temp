import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigType } from '@nestjs/config';
import redisConfig from 'src/configs/redis.config'
import { RestaurantDocument } from 'src/modules/restaurants/schemas/restaurant.schema';


const RESTAURANT_KEY = 'onemenu.hash.restaurant'

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
      open_hours: JSON.parse(restaurant.open_hours), 
      amenties: JSON.parse(restaurant.amenties),  
      cuisines: JSON.parse(restaurant.cuisines),  
      dishes: JSON.parse(restaurant.dishes),      
      price: JSON.parse(restaurant.price)         
    };
    return restaurantData
    
  }

  // async setRestaurant(restaurant: RestaurantDocument){
  async setRestaurant(restaurant: any){
    try{
      const _id = restaurant._id.toString()
      const key = `${RESTAURANT_KEY}.${_id}`
      
      const restaurantData = {
        ...restaurant, 
        location: JSON.stringify(restaurant.location), 
        images: JSON.stringify(restaurant.images),     
        open_hours: JSON.stringify(restaurant.open_hours), 
        amenties: JSON.stringify(restaurant.amenties),  
        cuisines: JSON.stringify(restaurant.cuisines),  
        dishes: JSON.stringify(restaurant.dishes),      
        price: JSON.stringify(restaurant.price)         
      };
  
      // Convert the restaurant data into an array of key-value pairs for Redis
      const restaurantEntries = Object.entries(restaurantData).flat();
  
      await this.hset(key, restaurantEntries)

      return true
    } catch(err){
      console.log(err);
      
      console.log("Error in setting restaurant in redis - ");
      return false
    }
    
  }


}