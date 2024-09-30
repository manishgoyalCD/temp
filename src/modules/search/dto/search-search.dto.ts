import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { SetMetadata } from '@nestjs/common';
import { PaginationPage, PaginationPerPage, PaginationSort } from 'src/common/pagination/decorators/pagination.decorator';
import { TransformDistance, TransformLatLong, TransformPriceRange } from '../decorators/search.decorator';
import { Type } from 'class-transformer';
import { PaginationListAbstract } from 'src/common/pagination/abstracts/pagination.abstract';
import { IPaginationSort } from 'src/common/pagination/interfaces/pagination.interface';
import { RESTAURANT_DEFAULT_AVAILABLE_SORT, RESTAURANT_DEFAULT_DISTANCE, RESTAURANT_DEFAULT_SORT } from '../constants/search.constant';

// export const ArticleGet = (...args: string[]) => SetMetadata('get-restaurants', args);

export class RestaurantSearchDto implements PaginationListAbstract {
    @ApiProperty({
      default: 1
    })
    @Type(()=>Number)
    @PaginationPage()
    page?: number;

    @ApiProperty({
      default: 20
    })
    @PaginationPage()
    @Type(()=>Number)
    @PaginationPerPage()
    per_page: number;

    @ApiProperty()
    @Type(()=>String)
    search?: string

    @ApiProperty()
    @Type(()=>Number)
    rating?: number

    @ApiProperty()
    @TransformDistance(RESTAURANT_DEFAULT_DISTANCE)
    distance?: number
    
    @ApiProperty()
    @TransformLatLong()
    location: {lat:number, lon: number}

    @ApiProperty({})
    @TransformPriceRange()
    price_range?: {min: number|null, max: number|null}
  
    // @ApiProperty()
    // opening_hours?: [number, number]

    @ApiProperty()
    @Type(()=>String)
    dietary: string
  
    @ApiHideProperty()
    @Type(()=>Number)
    skip?: number

    @PaginationSort(RESTAURANT_DEFAULT_SORT, RESTAURANT_DEFAULT_AVAILABLE_SORT)
    sort?: IPaginationSort;
  
}