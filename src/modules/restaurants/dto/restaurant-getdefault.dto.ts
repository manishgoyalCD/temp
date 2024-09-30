import { ApiProperty } from '@nestjs/swagger';
import { TransformDistance, TransformLatLong, TransformPriceRange } from '../decorators/restaurant.decorator';
import { Type } from 'class-transformer';
import { RESTAURANT_DEFAULT_AVAILABLE_SORT, RESTAURANT_DEFAULT_DISTANCE, RESTAURANT_DEFAULT_SORT } from '../constants/restaurant.constant';
import { PaginationSort } from 'src/common/pagination/decorators/pagination.decorator';
import { IPaginationSort } from 'src/common/database/interfaces/database.interface';
// export const ArticleGet = (...args: string[]) => SetMetadata('get-restaurants', args);

export class RestaurantGetDefaultDto {
    @ApiProperty()
    @TransformDistance(RESTAURANT_DEFAULT_DISTANCE)
    distance?: number

    @ApiProperty()
    @TransformLatLong()
    location: {lat:number, lon: number}

    @ApiProperty()
    @Type(()=>String)
    dietary?: string

    @PaginationSort(RESTAURANT_DEFAULT_SORT, RESTAURANT_DEFAULT_AVAILABLE_SORT)
    sort?: IPaginationSort;
  
  
}